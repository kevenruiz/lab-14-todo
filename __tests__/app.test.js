import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/todos', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    // append the token to your requests:
    //  .set('Authorization', user.token);

    let task =
    {
      id: 1,
      task: 'Catch \'em all',
      completed: false,
      //shared:,
      userId: 0,
      // userName:
    };

    it('VERB to /api/route [with context]', async () => {

      // remove this line, here to not have lint error:
      user.token;

      // expect(response.status).toBe(200);
      // expect(response.body).toEqual(?);

    });

  });
});

describe('api routes', () => {
  let user;

  afterAll(async () => {
    return client.end();
  });

  beforeAll(async () => {
    execSync('npm run recreate-tables');

    const response = await request
      .post('/api/auth/sighUp')
      .send({
        name: 'To Do Lover',
        email: 'lover@todo.com',
        password: 'cupid123'
      });
    expect(response.status).toBe(200);
    user = response.body;
  })
});

it('GET /api/me/todos', async () => {


  user.token;

  // expect(response.status).toBe(200);
  // expect(response.body).toEqual(?);

});

});
});