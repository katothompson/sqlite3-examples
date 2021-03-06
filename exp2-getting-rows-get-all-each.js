var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:') //creates db in memory, doesn't save it.

var numtasks = 10;
var data = [];

db.serialize(function () { 
      // create task table and add numtasks
      db.run('CREATE TABLE task (name TEXT, complete INTEGER)')
      var createtask = db.prepare('INSERT INTO task VALUES (?,?)')
      for (var i = 1; i <= numtasks; i++) {
            createtask.run('task ' + i, 0)
      }
      createtask.finalize();

      // get rows with db.get(), db.all(), db.each()

      // All three methods take a query string as the first parameter,
      // followed by an array of optional parameters,
      // followed by a callback function.

      // db.all collects all of the rows selected by the query in an array
      // and calls the callback function with the error and the array.
      // If there is no error, err will be null. If there are no rows, rows will be [].

      db.all('SELECT * FROM task', function (err, rows) {
            console.log(rows);
      })

      // Be kind and log errors

      db.all('SELECT notacolumn FROM task', function(err,rows) {
            if(err) {
                  console.log(err)
            } else {
                  console.log(rows)
            }
      })

      // db.get returns the first row selected by the query.

      db.get('SELECT * FROM task', function(err, row) {
            if (err) {
                  console.log(err)
            } else {
                  console.log(row)
            }
      })

      // db.each takes one more argument, the complete function.
      // It makes the query and then calls the callback function with each row. 
      // After all of the callback calls, it calls the complete function.
      // The complete function gets two arguments, the err and the number of rows.

      db.each('SELECT * FROM task WHERE name = "task 6" OR name = "task 10"', function(err, row) {      //the callback function
            console.log(row)
      } , function(err, num) {      //the complete function
            console.log('The query returned '+num+' rows.')
      })

      // watchout -- any operations performed on the db in the callback function will happen *after* the operations in the complete function!

      db.each('SELECT * FROM task', function(err, row){
            console.log(row)
            db.run('INSERT INTO task VALUES ("another task", 0)') //How many more rows are inserted? 10, because each time the callback fires, another is inserted.
      }, function(err, num) {
            console.log('The query returned '+num+' rows.') //Note that 10 and not 20 rows are returned.
      })


      db.all('SELECT * FROM task', function(err, rows) {
            console.log('Before the callback runs the query returns '+ rows.length + ' rows.')
      })

      // use setTimeout to show that top level db methods happen faster than methods in callback.

      setTimeout(function() {
            db.all('SELECT * FROM task', function(err, rows) {
                  console.log('After the callback runs the query returns ' + rows.length + ' rows.')
            })
      }, 2000)
      
      // Using optional parameters
      // Add question marks as place holders to the query string
      // the optional parameters will be bound to the question marks before execution.
      
      db.all('SELECT * FROM task WHERE name = ? AND complete = ?', ['task 8', 0], function(err, rows) {
            if(err) {
                  console.log(err)
            } else {
                  console.log(rows)
            }
      })
      // the place holders can also be named. Note that the optional parameters are now an object not an array.
      db.all('SELECT * FROM task WHERE name = $name AND complete = $complete', {$name:'task 9', $complete: 0}, function(err, rows) {
            if(err) {
                  console.log(err)
            } else {
                  console.log(rows)
            }
      })
})

//create server
var http = require('http');
var server = http.createServer();
server.listen(8080, ()=>{console.log("Server listening on port 8080");});

process.on('SIGINT', () => { //closes db when node receives SIGINT signal. SIGINT is generated by ctrl-c on all platforms
      console.log('closing server on 8080')
      db.close();
      server.close();
  });