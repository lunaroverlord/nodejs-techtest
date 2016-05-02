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

module.exports = router;
