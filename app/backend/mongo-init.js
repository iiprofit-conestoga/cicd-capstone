// Create the adminsyncDB database
db = db.getSiblingDB('adminsyncDB');

// Create users for the database
db.createUser({
  user: 'user_iiprofit',
  pwd: '499#Waterloo',
  roles: [
    { role: 'readWrite', db: 'adminsyncDB' }
  ]
});

db.createUser({
  user: 'user_priya',
  pwd: 'Capstone_2025',
  roles: [
    { role: 'readWrite', db: 'adminsyncDB' }
  ]
});

// Create users collection and insert initial data
db.users.insertMany([
  {
    email: 'iiprofit@mail.com',
    name: 'II Profit',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    email: 'priyas@mail.com',
    name: 'Priya',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for the users collection
db.users.createIndex({ email: 1 }, { unique: true }); 