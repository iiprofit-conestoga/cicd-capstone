// Set environment variables for testing
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.JWT_EXPIRE = '1h';
process.env.JWT_REFRESH_EXPIRE = '7d';
process.env.JWT_COOKIE_EXPIRE = 60 * 60 * 1000; // 1 hour in milliseconds
process.env.JWT_REFRESH_COOKIE_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Increase timeout for tests
jest.setTimeout(30000);

// Silence console logs during tests
console.log = jest.fn();
console.error = jest.fn();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}); 