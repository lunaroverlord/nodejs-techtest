var orm = require('orm');

orm.settings.set("instance.returnAllErrors", true);

connString = "mysql://techtest:zzraELJXa9nDUjGV@olafs.eu/techtest";

var DB = function()
{
}

DB.prototype.define = function (db, models) {
        var Carer = db.define("carer", {
                name           : String,
                postcode       : String,
                latitude       : Number, //FLOAT
                longitude      : Number, //FLOAT
                },
                {
                autoSave: true,
                autoFetch: true,
                methods: 
                {
                        coords: function () { return [this.longitude, this.latitude]; }
                },
                validations: {
                        name: [
                                orm.enforce.unique({ scope: ['postcode'] }, "Sorry, name is already registered at this postcode"),
                                orm.enforce.notEmptyString("Name can't be empty")
                        ]
                }
        });

        var Skill = db.define("skill", {
                name      : String
        });

        Carer.hasMany('skills', Skill, {}, {key: true, reverse: 'carers' });

        models.Carer = Carer;
        models.Skill = Skill;
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

//Express middleware connector
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
