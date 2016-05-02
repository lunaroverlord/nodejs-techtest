var express = require('express');
var router = express.Router();

var orm = require('orm');

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

/* GET carers by skills or postcode. */
router.get('/search', function(req, res, next) {
	console.log(req.models.Skill);
	var skillIds = req.query.skills.split(',');
	req.models.Skill.find({id: skillIds}, function(err, skills)
	{
		var carers = [];
		var collections = 0;

		// Count number of collections - one for each skill; each collection adds carers
		var collector = function(carersForSkill)
		{
			carers.push(carersForSkill);
			collections++;
			if(collections == skills.length)
			{
				var flat = [].concat.apply([], carers); //flatten
				var distilled = Array.from(new Set(flat)); //remove dupes
				res.end(JSON.stringify(distilled)); //send back
			}
		}

		// Query for carers for each skill
		skills.forEach(function(sk)
		{
			sk.getCarers(function(err, carers) {collector(carers);});
		});

		
		
	});
});

module.exports = router;
