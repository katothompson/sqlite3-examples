import test from 'ava';
const app = require('./exp8-node-sqlite3-express.js')
const request = require('supertest')(app);

// Let's use ava and supertest to test our app.
// This is better than ava-http because server does not have to be opened manually!
// (and the post requests work!)

// ava uses the test() 
// inside of the ava test(), supertest makes request of server.

// This is ava making a test
test('foo', t => {
	t.pass();
});
// This is ava making an async test.
test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});
// This is ava making an async test, inwhich supertest makes a post request to the server.
test('post request', async t => {
      const body = {name:"Jeremy"};
      const res = await request.post('/addworker', body)
            .send(body);
            //console.log(res);
      t.is(res.status, 200)
      t.is(res.body, body.name)
})
// Same, but a get request.
test('get request', async t => {
      const res = await request.get('/workers');
      t.is(res.status, 200);
})

// some info about supertest: 
// http://willi.am/blog/2014/07/28/test-your-api-with-supertest/
// https://www.npmjs.com/package/supertest
// https://github.com/avajs/ava/blob/master/docs/recipes/endpoint-testing.md