var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:') //creates db in memory, doesn't save it.

db.serialize(function () { 
      
      // create task table
      db.run('CREATE TABLE task (name TEXT, complete INTEGER)')

      // Using the prepare method, prepare a sqlite statement and store it in variable
      var createATask = db.prepare('INSERT INTO task VALUES (?,?)')

      // To use the prepared statement, use the .run method and pass the values for the placeholders.
      createATask.run('small task', 0)
      // Log the results:
      db.all("SELECT * FROM task", function(err, rows) {console.log(rows)} )
      createATask.finalize();

      // Database#prepare(sql, [param, ...], [callback])
      // The optional parameters are bound to the statement before callling the callback.

      var createATask = db.prepare('INSERT INTO task VALUES (?,?)', ['BIG TASK', 0])
      createATask.run()
      db.all("SELECT * FROM task", function(err, rows) {console.log(rows)} )
      createATask.finalize();

      // Database#prepare(sql, [param, ...], [callback])
      // the callback receives an error message.

      var createATask = db.prepare('INSERT INTO task VALUES (?,?)', ['Medium Task', 0], function(err) {
            if(err) {
                  console.log(err)
            } else (
                  console.log('no error!')
            )
      })
      createATask.run()
      db.all("SELECT * FROM task", function(err, rows) {console.log(rows)} )
      createATask.finalize();

      
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