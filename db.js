var orm = require('orm');


connString = "mysql://root:qwerty@localhost/techtest";
var DB = function()
{
}

DB.prototype.define = function (db, models) {
	//if (err) throw err;

	var Carer = db.define("carer", {
		name      : String,
		postcode   : String,
		latitude       : Number, // FLOAT
		longitude      : Number, //FLOAT
	}, {
		autoSave: true,
		methods: {
			fullName: function () {
				return this.name;
			}
		},
		validations: {
			//age: orm.enforce.ranges.number(18, undefined, "under-age")
		}
	});

	var Skill = db.define("skill", {
		name      : String
	});

	Carer.hasMany('skills', Skill, {}, {key: true, reverse: 'carers' });

	models.Carer = Carer;
	models.Skill = Skill;

	//console.log("adding to models %o", models);
	
}

DB.prototype.synchronize = function()
{
	orm.connect(connString, function(err, db)
	{
		if(err) throw err;
		models = {};
		DB.prototype.define(db, models);
		db.sync(function(err) { if(err) throw err; console.log("Sync OK");});
	});
}

//Returns just the models
DB.prototype.loadModels = function(callback)
{
	orm.connect(connString, function(err, db)
	{
		if(err) throw err;
		models = {};
		DB.prototype.define(db, models);
		callback(models);
	});
}

DB.prototype.express = function()
{
	return orm.express(connString, {
		define: function (db, models, next) {
			DB.prototype.define(db, models);
			next();
		}
	});
}


module.exports = new DB();
