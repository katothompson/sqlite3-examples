import test from 'ava';
import http from 'ava-http';

// Using Ava and Ava-http to test api.
// This works fine for get requests, but when making post requests, I can't figure out how 
// to pass the body to the server correctly using ava-http.
// Another drawback is that you have to run the server in one terminal, and the test in another.
// For api testing with ava, supertest was easier to use.

// unless running server on another terminal, skip tests using http, or will cause error when running other ava test files. 

// start server $ nodemon exp8-node-sqlite3-express.js
// then on a different terminal, $ npm test
// more info on ava-http can be found here: https://www.npmjs.com/package/ava-http
// list of assertions:
// https://github.com/avajs/ava#assertions

const baseurl = 'http://localhost:8080/';

// with ava you can make a note about what to write next.
test.todo('test that other thing')
// or you can skip over tests that aren't working right.
test.skip('causing problems!', t => {
      t.pass();
})


test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});

test.skip('get Hello World', async t => {
      const res = await http.get(baseurl);
      t.true(typeof res === 'string'); 
      t.is(res, 'Hello World'); 
  
})

test.skip('async/await', async t => {
	t.is(await http.get(baseurl), 'Hello World');
});

test.skip('get data', async t => {
      const res = await http.get(baseurl + 'data');
      //console.log(res)
      t.true(typeof res === 'object');
})

test.skip('post new worker to worker table', async t => {
      const body = {name:'Jane'};
      const res = await http.postResponse(baseurl + 'addworker', body); //http.post returns a promise, it takes a url and options
      console.log(res.statusCode)
      console.log(res.body)
      console.log(res.request['name'])
      t.true(typeof res === 'object');
      t.is(res.statusCode, 200)
})

test.skip('get workers', async t => {
      const res = await http.get(baseurl + 'workers');
      //console.log(res)
      t.true(typeof res === 'object');
})