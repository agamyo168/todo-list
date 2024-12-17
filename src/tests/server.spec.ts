import supertest from 'supertest';
import app from '../server';
import { StatusCodes } from 'http-status-codes';
import Users from '../models/users.model';
import Todos from '../models/todos.model';

const request = supertest(app);
let token = '';

afterAll(async () => {
  await Todos.sync({ force: true });
  await Users.sync({ force: true }); //Drops and recreates table -- Problem is that this creates a different table than the one in migrations -- Fix -> Just make sure migrations and model definition are the same OR don't use migrations at all.
  // await Users.destroy({}); //Deletes all rows in a table -- Problem is that this doesn't reset id counter
});
describe('Testing not-found middleware', () => {
  it(`should return ${StatusCodes.NOT_FOUND} for accessing invalid url`, async () => {
    const res = await request.get('/invalid-url');
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('Authentication route -->', () => {
  const ROUTE = '/api/v1/auth';
  describe('User Sign up scenario:', () => {
    it(`When given a valid email and password, should return ${StatusCodes.CREATED}, create a new user in database, and return {id, email}`, async () => {
      //arrange
      const user = {
        email: 'test1@gmail.com',
        password: '123456789',
      };
      //act
      const res = await request.post(`${ROUTE}/signup`).send(user);
      //assert
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.email).toBe(user.email);
    });
    it(`When given an already used email, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      //arrange
      const user = {
        email: 'test1@gmail.com',
        password: '123456789',
      };
      //act
      const res = await request.post(`${ROUTE}/signup`).send(user);
      //assert
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    it(`When given a password of short length, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      //arrange
      const user = {
        email: 'test2@gmail.com',
        password: '12',
      };
      //act
      const res = await request.post(`${ROUTE}/signup`).send(user);
      //assert
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    it(`When providing an empty body, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      //arrange
      const user = {};
      //act
      const res = await request.post(`${ROUTE}/signup`).send(user);
      //assert
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    it(`When providing invalid email, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      //arrange
      const user = {
        email: 'asddsag-com',
        password: '123456789',
      };
      //act
      const res = await request.post(`${ROUTE}/signup`).send(user);
      //assert
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
  //User login
  describe('User Login scenario:', () => {
    it(`When given a valid registered user, should return ${StatusCodes.OK} status and a token`, async () => {
      const user = {
        email: 'test1@gmail.com',
        password: '123456789',
      };
      const res = await request.post(`${ROUTE}/login`).send(user);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.user.id).toBe(1);
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.token).toMatch(
        /^[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+$/
      );
      if (
        res.body.token.match(/^[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+$/)
      ) {
        token = res.body.token;
      }
    });
    it(`When given invalid user credentials, should return ${StatusCodes.BAD_REQUEST} status and token`, async () => {
      const user = {
        email: 'invalid@gmail.com',
        password: '123456789',
      };
      const res = await request.post(`${ROUTE}/login`).send(user);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});

describe('Todos route -->', () => {
  const ROUTE = '/api/v1/todos';
  const taskTest = {
    id: 1,
    title: 'Homework',
    desc: 'Chapter 1&2 Math',
    check: true,
  };
  describe(`POST ${ROUTE}`, () => {
    it(`When attempting to add a task but you don't have access token, should return ${StatusCodes.UNAUTHORIZED}`, async () => {
      const res = await request.post(`${ROUTE}/`);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });
    it(`When attempting to add a task but you didn't provide a valid task, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      const res = await request
        .post(`${ROUTE}/`)
        .auth(token, { type: 'bearer' })
        .send({});
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    it(`When adding a new task, should return ${StatusCodes.CREATED} and an object of type Task that was created.`, async () => {
      const res = await request
        .post(`${ROUTE}/`)
        .send(taskTest)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(StatusCodes.CREATED);
      const { title, desc, check, id } = res.body.todo;
      expect({ title, desc, check, id }).toEqual(taskTest);
    });
  });
  describe(`PATCH ${ROUTE}/:taskId`, () => {
    it(`When updating a task, should return ${StatusCodes.OK} and an object of type Task that was updated.`, async () => {
      const res = await request
        .patch(`${ROUTE}/${taskTest.id}`)
        .send(taskTest)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(StatusCodes.OK);
      const { title, desc, check, id } = res.body.todo;
      expect({ title, desc, check, id }).toEqual(taskTest);
    });
    it(`When updating a task that doesn't exist, should return ${StatusCodes.NOT_FOUND}`, async () => {
      const res = await request
        .patch(`${ROUTE}/99`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
  describe(`GET ${ROUTE}`, () => {
    it(`When attempting to get all user tasks but you don't have access token, should return ${StatusCodes.UNAUTHORIZED}`, async () => {
      const res = await request.get(`${ROUTE}/`);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });
    it(`When attempting to get all user tasks as a signed in user with access token, should return ${StatusCodes.OK} and an array of type Task[]`, async () => {
      const res = await request
        .get(`${ROUTE}/`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(StatusCodes.OK);
      const { title, desc, check, id } = res.body.todo[0];

      expect({ title, desc, check, id }).toEqual(taskTest);
    });
    it(`When getting a task by id, should return ${StatusCodes.OK} and an object of type Task`, async () => {
      const res = await request
        .get(`${ROUTE}/1`)
        .auth(token, { type: 'bearer' });
      const { title, desc, check, id } = res.body.todo;
      expect(res.status).toBe(StatusCodes.OK);
      expect({ title, desc, check, id }).toEqual(taskTest);
    });
    it(`When getting a task by id but that task doesn't belong to the logged in user or there's no task with that id, should return ${StatusCodes.NOT_FOUND}`, async () => {
      const res = await request
        .get(`${ROUTE}/99`)
        .auth(token, { type: 'bearer' });
      expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
