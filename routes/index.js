var express = require('express');
var router = express.Router();

var orm = require('orm');
var turf = require('turf');

/* GET home page. */
router.get('/', function(req, res, next) {
        req.models.Skill.find({}, function(err, skills)
        {
                res.render('index', { title: 'Olaf tech test', active: "search", skills: JSON.stringify(skills) });
        });
});

/*
 * Search
 */

/* GET skills list. */
router.get('/get-skills', function(req, res, next) {
        req.models.Skill.find({name: orm.like('%'+req.query.q+'%')}, function(err, result)
        {
                var skills = JSON.stringify(result);
                res.end(skills);
        });

});

/* GET carers by skills. If postcode is supplied, attach distances to the results. */
router.get('/search', function(req, res, next) {
        var skillIds = req.query.skills.split(',');
        var target = req.query.target;

        // For each requested skill...
        req.models.Skill.find({id: skillIds}, function(err, skills)
        {
                var carers = [];
                var collections = 0;

                // Asynchronous collector - sends http response only when full
                var collector = function(carersForSkill)
                {
                        // Count number of collections - one for each skill; each collection adds carers
                        collections++;
                        carers.push(carersForSkill);

                        // If all collected
                        if(collections == skills.length)
                        {
                                var flat = [].concat.apply([], carers); //flatten
                                var distilled = Array.from(new Set(flat)); //remove dupes
                                if(target) //add dist to target
                                        distilled = addDistanceToCarers(distilled, target); 
                                res.end(JSON.stringify(distilled)); //send back
                        }
                }

                // Get carers for each skill using the collector
                if(skills.length > 0)
                        skills.forEach(function(sk)
                        {
                                sk.getCarers(function(err, carers) {collector(carers);});
                        });
                //Otherwise, return carers in distance order
                else if(target)
                {
                        req.models.Carer.all(function(err, carers)
                        {
                                carers = addDistanceToCarers(carers, target); 
                                res.end(JSON.stringify(carers)); //send back
                        });
                }

                
                
        });
});

// Helper used to augment the JSON array of carers with distances from 'pointFrom'
function addDistanceToCarers(carers, target)
{
        carers.forEach(
                function(c)
                { 
                        //long, lat
                        var startPoint = turf.point(target);
                        var endPoint = turf.point([c["longitude"], c["latitude"]]);
                        c.distance = turf.distance(startPoint, endPoint); 
                });
        return carers;
}

/*
 * Registrations 
 */

// GET
router.get('/register', function(req, res, next) {
        res.render('register', {active: "register", title: 'Register' });
});

// POST
router.post('/register', function(req, res, next) {
        // Skillls:
        // numeric skills are existing IDs
        // plaintext skills are new skills
        if(req.body.skills == '')
        {
                res.render('register', {error: "Must add at least 1 skill"});
                return res.end();
        }
        var skillsList = req.body.skills.split(',');//.map(s => s.trim());

        getSkillObjects(req.models, skillsList,
                function(skillObjects)
                {
                        var coords = req.body.coords.split(',');
                        req.models.Carer.create(
                                {
                                        name: req.body.name,
                                        skills: skillObjects,
                                        postcode: req.body.postcode,
                                        longitude: coords[0],
                                        latitude: coords[1]
                                }, function(err)
                                {
                                        if(err)
                                        {
                                                if(err instanceof Array)
                                                        res.render('register', {error: err[0].msg});
                                                else
                                                        res.render('register', {error: "Error: " + err});
                                        }
                                        else res.render('register', {message: "Registered successfully"});
                                });
                });
        
});

// Retrieves model.Skill objects for a given skills list, creating new records as needed
// callback: function(skillObjects)
function getSkillObjects(models, skillsList, callback)
{

        // Collector for DB objects
        var skillObjects = [];
        var skillsCollector = function(s)
        {
                skillObjects.push(s);
                if(skillObjects.length == skillsList.length)
                        callback(skillObjects);
        };

        // Check each item
        var newSkills = [];
        skillsList.forEach(function(skillToken)
        {
                //numeric id
                if(isFinite(skillToken))
                {
                        models.Skill.find({id: skillToken}, function(err, data)
                        {
                                skillsCollector(data[0]);
                        });
                }
                //new skill
                else 
                {
                        newSkills.push({name: skillToken});
                }
        });

        //Create and collect objects of new skills
        models.Skill.create(newSkills, function(err, items)
        {
                items.map(skillsCollector);
        });
}
module.exports = router;
