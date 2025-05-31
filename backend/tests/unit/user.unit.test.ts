import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

import { app } from '../../src/app';
import { getEnvOrThrow } from '../../src/config/env';

const JWT_SECRET = getEnvOrThrow('JWT_SECRET');

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

// Helper para criar tokens JWT
const createToken = (userId: string, role: string = 'user') => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};



describe('User routes', () => {
  let regularUserId: string;
  let regularUserToken: string;

  beforeEach(async () => {
    // Criar usuário regular
    const regularUserRes = await request(app.express)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: '123456'
      });

    regularUserId = regularUserRes.body.user.id;
    regularUserToken = regularUserRes.body.token;
  });

  describe('GET /api/users/:id', () => {
    it('should get own user profile with token', async () => {
      const res = await request(app.express)
        .get(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', regularUserId);
      expect(res.body).toHaveProperty('name', 'Regular User');
      expect(res.body).toHaveProperty('email', 'user@example.com');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app.express)
        .get(`/api/users/${regularUserId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 when user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app.express)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app.express)
        .get(`/api/users/${regularUserId}`)
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update user profile with valid token', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', regularUserId);
      expect(res.body).toHaveProperty('name', 'Updated Name');
      expect(res.body).toHaveProperty('email', 'updated@example.com');
    });

    it('should update only name', async () => {
      const updateData = {
        name: 'Only Name Updated'
      };

      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Only Name Updated');
      expect(res.body).toHaveProperty('email', 'user@example.com'); // Email não mudou
    });

    it('should update only email', async () => {
      const updateData = {
        email: 'newemail@example.com'
      };

      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'newemail@example.com');
      expect(res.body).toHaveProperty('name', 'Regular User'); // Nome não mudou
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 when user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app.express)
        .patch(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', 'Bearer invalid-token')
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user account with valid token', async () => {
      const res = await request(app.express)
        .delete(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted successfully');

      // Verificar se o usuário foi realmente deletado
      const checkRes = await request(app.express)
        .get(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(checkRes.statusCode).toBe(404);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app.express)
        .delete(`/api/users/${regularUserId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 when user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      const res = await request(app.express)
        .delete(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app.express)
        .delete(`/api/users/${regularUserId}`)
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle invalid user ID format', async () => {
      const res = await request(app.express)
        .get('/api/users/invalid-id')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(res.body).toHaveProperty('error');
    });

    it('should handle empty update data', async () => {
      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send({});

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', regularUserId);
    });

    it('should ignore invalid fields in update', async () => {
      const updateData = {
        name: 'Valid Name',
        invalidField: 'This should be ignored',
        password: 'This should also be ignored'
      };

      const res = await request(app.express)
        .patch(`/api/users/${regularUserId}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Valid Name');
      expect(res.body).not.toHaveProperty('invalidField');
      expect(res.body).not.toHaveProperty('password');
    });
  });
});