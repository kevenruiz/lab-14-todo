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
          name: 'To Do Lover',
          email: 'lover@todo.com',
          password: 'cupid123'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    let task =
    {
      id: 1,
      task: 'Catch \'em all',
      completed: false,
      //shared:,
      userId: 0,
      // userName:
    };

    it('POST task to /api/todos', async () => {

      const response = await request
        .post('/api/todos')
        .set('Authorization', user.token)
        .send(task);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        userId: user.id,
        ...task
      });
    });

    task = response.body;

    it('GET /api/me/todos', async () => {

      const otherTodoResponse = await request
        .post('/api/todos')
        .set('Authorization', user.token)
        .send({
          task: 'Catch \'em all',
          completed: false,
          //shared:,
          userId: 1,
          // userName:
        });

      expect(otherTodoResponse.status).toBe(200);
      const otherTodo = otherTodoResponse.body;

      // we are testing this
      const response = await request.get('/api/me/books')
        .set('Authorization', user.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([otherTodo]));

    });

  });
});


// it('VERB to /api/route [with context]', async () => {

//   // remove this line, here to not have lint error:
//   user.token;

//   // expect(response.status).toBe(200);
//   // expect(response.body).toEqual(?);

// });