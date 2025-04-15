const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/userModel');

let mongoServer;

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
});

describe('Login API', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '1234567890',
    role_id: 'employee'
  };

  beforeEach(async () => {
    // Create a test user before each test
    await User.create(testUser);
  });

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user).toHaveProperty('email', testUser.email);
    expect(response.body.data.user).toHaveProperty('role_id', testUser.role_id);
  });

  it('should return error for invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: testUser.password
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return error for invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return error when email is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: testUser.password
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Please provide email and password');
  });

  it('should return error when password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email
      });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Please provide email and password');
  });

  it('should return error when both email and password are missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Please provide email and password');
  });
}); 