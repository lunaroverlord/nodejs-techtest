# node.js test

## Installing
The default settings allow you to run it with the database hosted on my server.
###Own database:
To run your own DB, set up a MySQL server and import `techtest/techtest.sql`. Configure access credentials in db.js, this line:
```
connString = "mysql://techtest:zzraELJXa9nDUjGV@108.61.173.171:3306/techtest";
```
Format: `protocol://user:password@host:port/database`
## Running
```
npm install
./run.sh
```
## Bugs
* Skill lookups are case-sensitive; this requires a change of ORM
* Skills can't be numbers (I don't think anyone needs that, but still)

## Tech
* [node.js] - evented I/O for the backend
* [Twitter Bootstrap] - UI boilerplate
* [Express] - fast node.js network app framework
* [Mocha] - testing framework
* [jQuery]  

## Todo
 * Write Tests
 * jslint checklist

   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [Mocha]: <https://mochajs.org/>

