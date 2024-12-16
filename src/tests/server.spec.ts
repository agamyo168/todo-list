import supertest from 'supertest';
import app from '../server';
import { StatusCodes } from 'http-status-codes';
import Users from '../models/users.model';

const request = supertest(app);

afterAll(async () => {
  await Users.sync({ force: true }); //Drops and recreates table -- Problem is that this creates a different table than the one in migrations -- Fix -> Just make sure migrations and model definition are the same OR don't use migrations at all.
  // await Users.destroy({}); //Deletes all rows in a table -- Problem is that this doesn't reset id counter
});
describe('Testing not-found middleware', () => {
  it(`should return ${StatusCodes.NOT_FOUND} for accessing invalid url`, async () => {
    const res = await request.get('/invalid-url');
    expect(res.status).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('Authentication route', () => {
  describe('User Sign up', () => {
    it(`When given a valid email and password, should return ${StatusCodes.CREATED}, create a new user in database, and return {id, email}`, async () => {
      //arrange
      const user = {
        email: 'asdas@gmail.com',
        password: '12345',
      };
      //act
      const res = await request.post('/api/v1/auth/signup').send(user);
      //assert
      expect(res.status).toBe(StatusCodes.CREATED);
      expect(res.body.email).toBe(user.email);
    });
    it(`When given an already used email, should return ${StatusCodes.BAD_REQUEST}`, async () => {
      //arrange
      const user = {
        email: 'asdas@gmail.com',
        password: '12345',
      };
      //act
      const res = await request.post('/api/v1/auth/signup').send(user);
      //assert
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
  describe('User Login', () => {
    it(`When given a valid registered user, should return ${StatusCodes.OK} status and token`, async () => {
      const user = {
        email: 'asdas@gmail.com',
        password: '12345',
      };
      const res = await request.post('/api/v1/auth/login').send(user);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body.user.id).toBe(1);
      expect(res.body.user.email).toBe(user.email);
    });
  });
});
