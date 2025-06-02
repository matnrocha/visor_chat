import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../../src/app';

let mongoServer: MongoMemoryServer;
let token: string;
let sessionId: string;

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

describe('Chat routes', () => {
  beforeEach(async () => {
    await request(app.express)
      .post('/api/auth/register')
      .send({ name: 'User', email: 'test@example.com', password: 'senha123' });

    const res = await request(app.express)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'senha123' });

    token = res.body.token;
  });

  it('should create a session', async () => {
    const res = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({ modelType: 'gemini-pro' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    sessionId = res.body.id;
  });

  it('should send and receive messages in a session', async () => {
    const createRes = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({ modelType: 'gemini-pro' });

    sessionId = createRes.body.id;

    const res = await request(app.express)
      .post(`/api/sessions/${sessionId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Explique TypeScript' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('role', 'model');
  }, 15000);

  it('should list messages of a session', async () => {
    // Cria sessão
    const createRes = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({ modelType: 'gemini-pro' });

    sessionId = createRes.body.id;

    // Envia uma mensagem
    await request(app.express)
      .post(`/api/sessions/${sessionId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Explique TypeScript' });

    // Lista mensagens
    const res = await request(app.express)
      .get(`/api/sessions/${sessionId}/messages`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  }, 15000);
});
