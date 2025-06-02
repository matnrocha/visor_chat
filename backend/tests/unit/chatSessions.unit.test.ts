import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app';

let mongoServer: MongoMemoryServer;
let authToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  authToken = await createTestUserAndGetToken();
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
  
  authToken = await createTestUserAndGetToken();
});

async function createTestUserAndGetToken(): Promise<string> {
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

  return loginRes.body.token;
}

describe('Chat Session Routes', () => {
  it('should create a new chat session', async () => {
    const res = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        modelType: 'gpt-3.5'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toMatch(/New gpt-3.5 Chat/);
  });

  it('should list all sessions for user', async () => {
    await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ modelType: 'gpt-3.5' });

    await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ modelType: 'gpt-4' });

    const res = await request(app.express)
      .get('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should get session details', async () => {
    const createRes = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ modelType: 'gpt-3.5' });

    const sessionId = createRes.body.id;

    const res = await request(app.express)
      .get(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(sessionId);
    expect(res.body.modelType).toBe('gpt-3.5');
  });

  it('should update session title', async () => {
    const createRes = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ modelType: 'gpt-3.5' });

    const sessionId = createRes.body.id;

    const res = await request(app.express)
      .patch(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Session title updated successfully');

    const getRes = await request(app.express)
      .get(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.body.title).toBe('Updated Title');
  });

  it('should delete a session', async () => {
    const createRes = await request(app.express)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ modelType: 'gpt-3.5' });

    const sessionId = createRes.body.id;

    const res = await request(app.express)
      .delete(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Session deleted successfully');

    const getRes = await request(app.express)
      .get(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.statusCode).toBe(400);
  });
});
