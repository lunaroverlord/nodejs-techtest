# node.js test

## Install & run
Set up a MySQL database with imported data from techtest/techtest.sql

Configure access credentials in db.js 

```
npm install
npm start
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

