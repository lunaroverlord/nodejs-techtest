var express = require('express');
var router = express.Router();

var orm = require('orm');
var turf = require('turf');

/* GET home page. */
router.get('/', function(req, res, next) {
	req.models.Skill.find({}, function(err, skills)
	{
		res.render('index', { title: 'Olaf tech test', skills: JSON.stringify(skills) });
	});
});

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

		// Get (collect) carers for each skill
		skills.forEach(function(sk)
		{
			sk.getCarers(function(err, carers) {collector(carers);});
		});

		
		
	});
});

// Helper used to augment the JSON array of carers with distances from 'pointFrom'
function addDistanceToCarers(carers, target)
{
	carers.forEach(
		c =>
		{ 
			//long, lat
			var startPoint = turf.point(target);
			var endPoint = turf.point([c["longitude"], c["latitude"]]);
			c.distance = turf.distance(startPoint, endPoint); 
		});
	return carers;
}

router.get('/register', function(req, res, next) {
	res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
	//req.models.Carer.crete
	console.log(req.body);
	res.end("Success");
});

module.exports = router;
