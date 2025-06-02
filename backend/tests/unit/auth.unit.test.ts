import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth routes', () => {
  it('should register a new user', async () => {
    const res = await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Mateus',
        email: 'mateus@example.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('mateus@example.com');
    expect(res.body).toHaveProperty('token');
  });

  it('should not register with existing email', async () => {
    await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Mateus',
        email: 'mateus@example.com',
        password: '123456'
      });

    const res = await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Outro Mateus',
        email: 'mateus@example.com',
        password: 'abcdef'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login with correct credentials', async () => {
    // Primeiro registra
    await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Mateus',
        email: 'mateus@example.com',
        password: '123456'
      });

    // Depois tenta logar
    const res = await request(app.express)
      .post('/api/auth/login')
      .send({
        email: 'mateus@example.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong credentials', async () => {
    // Registra
    await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Mateus',
        email: 'mateus@example.com',
        password: '123456'
      });

    // Tenta logar com senha errada
    const res = await request(app.express)
      .post('/api/auth/login')
      .send({
        email: 'mateus@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
