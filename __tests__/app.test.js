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
      userId: 1,
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
      task = response.body;
    });


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
      const response = await request.get('/api/todos')
        .set('Authorization', user.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.not.arrayContaining([task, otherTodo]));

    });

    it('PUT /api/todos/:id/completed', async () => {
      task.completed = true;
      task.task = 'raise army of guinea pigs';
      // remove this line, here to not have lint error:

      const response = await request
        .put(`/api/todos/${task.id}`)
        .set('Authorization', user.token)
        .send(task);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(task);

    });

    it('DELETE task from /api/todos/:id', async () => {
      const response = await request
        .delete(`/api/todos/${task.id}`)
        .set('Authorization', user.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(task);

      const newResponse = await request
        .get('/api/todos/')
        .set('Authorization', user.token);

      expect(newResponse.status).toBe(200);
      expect(newResponse.body).toEqual(expect.not.arrayContanting([task]));

      // const todoResponseBody = todoResponse.body;

      // const response = await request.delete(`/api/me/todos/${todoResponseBody.id}`)

    });

  });
});