const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

let mongoServer;
let adminToken;
let employeeToken;
let adminUser;
let employeeUser;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Close database connection and stop the server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await User.deleteMany({});
  
  // Create test users
  adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    phoneNumber: '1234567890',
    role_id: 'admin'
  });
  
  employeeUser = await User.create({
    name: 'Employee User',
    email: 'employee@example.com',
    password: 'password123',
    phoneNumber: '9876543210',
    role_id: 'employee'
  });
  
  // Generate tokens
  adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '7d'
  });
  
  employeeToken = jwt.sign({ id: employeeUser._id }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: '7d'
  });
});

describe('User API', () => {
  describe('POST /api/users/add', () => {
    it('should allow admin to add a new user', async () => {
      const response = await request(app)
        .post('/api/users/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          phoneNumber: '1234567890',
          role_id: 'employee'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('email', 'newuser@example.com');
      expect(response.body.data).toHaveProperty('role_id', 'employee');
    });

    it('should not allow employee to add a new user', async () => {
      const response = await request(app)
        .post('/api/users/add')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          phoneNumber: '1234567890',
          role_id: 'employee'
        });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should not allow adding user with duplicate email', async () => {
      const response = await request(app)
        .post('/api/users/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Duplicate User',
          email: 'admin@example.com',
          password: 'password123',
          phoneNumber: '1234567890',
          role_id: 'employee'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    it('should require authentication to add a user', async () => {
      const response = await request(app)
        .post('/api/users/add')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          phoneNumber: '1234567890',
          role_id: 'employee'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/users/all', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app)
        .get('/api/users/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should not allow employee to get all users', async () => {
      const response = await request(app)
        .get('/api/users/all')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should require authentication to get all users', async () => {
      const response = await request(app)
        .get('/api/users/all');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/users/profile/:id', () => {
    it('should allow user to get their own profile', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${employeeUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('email', 'employee@example.com');
    });

    it('should allow admin to get any user profile', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${employeeUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('email', 'employee@example.com');
    });

    it('should not allow user to get another user profile', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${adminUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/users/profile/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PUT /api/users/profile/:id', () => {
    it('should allow user to update their own profile', async () => {
      const response = await request(app)
        .put(`/api/users/profile/${employeeUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Updated Employee Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name', 'Updated Employee Name');
    });

    it('should allow admin to update any user profile', async () => {
      const response = await request(app)
        .put(`/api/users/profile/${employeeUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated by Admin'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name', 'Updated by Admin');
    });

    it('should not allow user to update another user profile', async () => {
      const response = await request(app)
        .put(`/api/users/profile/${adminUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Unauthorized Update'
        });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should not allow updating email to an existing email', async () => {
      const response = await request(app)
        .put(`/api/users/profile/${employeeUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          email: 'admin@example.com'
        });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow admin to edit user details', async () => {
      const response = await request(app)
        .put(`/api/users/${employeeUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Edited Employee',
          email: 'edited@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('name', 'Edited Employee');
      expect(response.body.data).toHaveProperty('email', 'edited@example.com');
    });

    it('should not allow employee to edit users', async () => {
      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Edited Admin'
        });

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should not allow updating email to an existing email', async () => {
      const response = await request(app)
        .put(`/api/users/${employeeUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'admin@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow admin to delete a user', async () => {
      const response = await request(app)
        .delete(`/api/users/${employeeUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      // Verify user is deleted
      const deletedUser = await User.findById(employeeUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should not allow employee to delete users', async () => {
      const response = await request(app)
        .delete(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.status).toBe('error');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.status).toBe('error');
    });
  });
}); 