var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var db = require("../db.js");

var stage = "mapping"; // skills / carers / mapping

db.loadModels(function(models)
{
	fs.readFile('tech_test_carer_data.csv', function (err, data) {

		if(err) throw err;

		var text = data.toString();
		var lines = text.split('\n');

		//1. Skills
		var carerSkills = [];
		var totalSkills = new Set();
		lines.forEach(function(line, index) {
			var parts = line.split('\t');
			if(parts.length == 3 && index > 0)
			{
				var name = parts[0];
				var skills = parts[2].split(',');

				//1. insert the person (without skills yet)
				if(stage == "carers")
					insertCarerRecord(parts, models);
				
				//2. collect skills
				if(stage == "skills")
				{
					carerSkills[name] = skills;
					skills.forEach(function(skill) {
						totalSkills.add(skill.trim());});
				}
				
				//3. Associate skills with carers
				if(stage == "mapping")
				{
					models.Carer.find({name: name},
					function(err, carerObj)
					{
						skills.forEach(function(skillName, index)
						{
							models.Skill.find({name: skillName.trim()},
							function(err, skillObj)
							{
								carerObj[0].addSkills(skillObj);
							});
						});
					});
				}

			}
		});

		if(stage == "skills")
		{
			var skillEntries = Array.from(totalSkills).map(function(sk){return {name: sk};});
			models.Skill.create(skillEntries);
		}
	});
});

function insertCarerRecord(parts, models)
{ 
	models.Carer.create(
			[{
				name: parts[0],
				postcode: parts[1],
			}], function(err, item)
			{
				if(err) throw err;
				insertCarerCoords(models, item[0], parts[1]);
				console.log("Carer OK ");
			});
}

function insertCarerCoords(models, Carer, postcode)
{
	//Get coords from postcodes.io
	var options = {
		host: 'api.postcodes.io',
		path: '/postcodes/' + querystring.escape(postcode)
	};

	http.request(options, function(response) {
			var str = '';
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function()
			{
				var resp = JSON.parse(str);
				//console.log(resp);
				var loc = {"longitude": resp["result"]["longitude"],
					"latitude": resp["result"]["latitude"]};
				//set lat/lon
				Carer.latitude = loc["latitude"];
				Carer.longitude = loc["longitude"];	
			});
		}).end();
}
