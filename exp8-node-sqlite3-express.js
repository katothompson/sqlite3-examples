var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:') //creates db in memory, doesn't save it.

var numtasks = 10;
var workers = ['Larry', 'Moe', 'Curly']
var data = [];

// let's make a database containing three tables, task, worker, and taskworker.
// Then, insert data into the tables.

db.serialize(function () { 
      
      // create task table and add numtasks
      db.run('CREATE TABLE task (name TEXT, complete INTEGER)')
      var createtask = db.prepare('INSERT INTO task VALUES (?,?)')
      for (var i = 1; i <= numtasks; i++) {
            createtask.run('task ' + i, 0)
      }
      createtask.finalize();

      // create worker table and add workers
      db.run('CREATE TABLE worker (name TEXT)')
      var createworker = db.prepare('INSERT INTO worker VALUES (?)')
      for (var i = 0; i < workers.length; i++ ) {
            db.run('INSERT INTO worker VALUES (?)', [workers[i]])
      }
      createworker.finalize()

      // create taskworker table and add workers to each task
      db.run('CREATE TABLE taskworker (taskId INTEGER, workerId INTEGER, complete INTEGER )')
      var createtaskworker = db.prepare('INSERT INTO taskworker VALUES (?,?,0)')
      for ( i = 1; i <= numtasks; i++) {
            for (j = 1; j <= workers.length; j++) {
                  createtaskworker.run(i,j)
            }
      }
      createtaskworker.finalize();

      // create a view of the taskworker table that includes the name column from worker table
      db.run('CREATE VIEW twwview AS SELECT t.*, w.* FROM taskworker t, worker w WHERE workerId = w.rowid')

})

// create server 

var express = require('express');
var restfulapi = express();
var bodyParser = require('body-parser')

restfulapi.use(bodyParser.json())

// make get and post requests to server

restfulapi.get('/data', function(req, res) {
      var thenumberofselectedrows;
      
            db.each('SELECT rowid, name, complete FROM task', 
            function(err, row) {
                  db.all('SELECT * FROM twwview WHERE taskId = ?', [row.rowid], function(err, rows) {
                        row.workers = rows
                        data.push(row)
                        if( data.length === thenumberofselectedrows ) {
                              res.json(data);
                        }    
                  })
            }, 
            function(err, num) {
                  thenumberofselectedrows = num; 
            })
})

restfulapi.get('/workers', function(req, res) {
      db.all('SELECT * FROM worker', function(err, rows) {
            res.json(rows)
      })
})

restfulapi.get('/', function(req, res) {
      res.send('Hello World')
})

restfulapi.post('/addworker', function(req, res) {
      const name = req.body.name;
      db.run('INSERT INTO worker VALUES (?)', [name], function(err) {
            if(err) {
                  console.log(err)
            } else {
                  res.json(name)
            }
      })
})



var server = restfulapi.listen(8080, ()=>{console.log("Server listening on port 8080")})

process.on('SIGINT', () => { //closes db when node receives SIGINT signal. SIGINT is generated by ctrl-c on all platforms
      console.log('closing server on 8080');
      server.close(()=>{
            console.log('closing db now')
            db.close();
      })
});

// export the server for testing with supertest
module.exports = server;