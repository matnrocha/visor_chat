import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app';

let mongoServer: MongoMemoryServer;
let authToken: string;
let sessionId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  await request(app.express)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

  const loginRes = await request(app.express)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });

  authToken = loginRes.body.token;

  const sessionRes = await request(app.express)
    .post('/api/sessions')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ modelType: 'gpt-3.5' });

  sessionId = sessionRes.body.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (key !== 'users' && key !== 'chatsessions') {
      await collections[key].deleteMany({});
    }
  }
});

describe('Message Routes', () => {
  it('should send and get messages', async () => {
    const sendRes = await request(app.express)
      .post(`/api/sessions/${sessionId}/messages`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Hello, world!' });

    expect(sendRes.statusCode).toBe(201);
    expect(sendRes.body).toHaveProperty('id');
    expect(sendRes.body.content.trim()).toBe('Hello, world!');
    expect(sendRes.body.role).toBe('model');

    const getRes = await request(app.express)
      .get(`/api/sessions/${sessionId}/messages`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(2);

    expect(getRes.body[0].content).toBe('Hello, world!'); // mensagem do usuário
    expect(getRes.body[0].role).toBe('user');

    expect(getRes.body[1].role).toBe('model');
    expect(getRes.body[1].content).toBeDefined(); // pode validar o conteúdo esperado do modelo aqui, se possível
  });
});
