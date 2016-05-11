var request = require('supertest');
var app = require("./app.js");

/*
 * Tests assume that the provided database with 6 carers is connected on app
 */

describe('Skills getter returns Autism for query "s"', function()
{
        /*
         * 's' should return 'Autism'
         */
        it('Returns the expected skill from a simple query', function(done)
        {
                request(app)
                        .get('/get-skills?q=s')
                        .expect(200)
                        .expect(function(res)
                        {
                                var obj = JSON.parse(res.text);
                                for(x in obj)
                                        if(obj[x]["name"] == "Autism")
                                                return;
                                throw new Error("Missing skill 'Autism' for query 's'");
                        })
                .end(done)
        });
});

describe('Carers can be retrieved', function()
{
        /*
         * James Bond and Kiera Knightley possess skills 94, 98  
         */
        it('Returns the correct carers James and Kiera for their skills 94, 98', function(done)
        {
                request(app)
                        .get('/search?skills=94,98')
                        .expect(200)
                        .expect(function(res)
                        {
                                var obj = JSON.parse(res.text);
                                var flags = 0;
                                for(x in obj)
                                {
                                        if(obj[x]["name"] == "James Bond")
                                                flags++;
                                        if(obj[x]["name"] == "Kiera Knightley")
                                                flags++;
                                }
                                if(flags != 2)
                                        throw new Error("Wrong carers returned for skillset");
                        })
                .end(done)
        });

        /*
         * Postcode: SE13 5EB (random)
         * Coords (lat/lon): 51.4612232818, -0.000499010074923
         * Approx. distance from Bob Diamond with skill 81: 10km
         * http://tinyurl.com/hkynm64
         */
        it('Distance from Bob Diamond to a spot 10km away is calculated correctly', function(done)
        {
                request(app)
                        .get('/search?skills=81&target[]=-0.000499010074923&target[]=51.4612232818')
                        .expect(200)
                        .expect(function(res)
                        {
                                var obj = JSON.parse(res.text);
                                for(x in obj)
                                {
                                        if(obj[x]["name"] == "Bob Diamond"
                                                && obj[x]["distance"] < 12
                                                && obj[x]["distance"] > 8)
                                                break;
                                        else throw new Error("Distance not quite right");
                                }
                        })
                .end(done)
        });
});
