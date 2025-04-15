#!/bin/bash

# Wait for MongoDB to start
until mongosh --host localhost --port 27017 --eval "print(\"MongoDB is up\")" > /dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 2
done

# Create the adminsyncDB database and users
mongosh admin --eval '
  db = db.getSiblingDB("adminsyncDB");
  
  // Create users for the database
  db.createUser({
    user: "user_iiprofit",
    pwd: "499#Waterloo",
    roles: [
      { role: "readWrite", db: "adminsyncDB" }
    ]
  });
  
  db.createUser({
    user: "user_priya",
    pwd: "Capstone_2025",
    roles: [
      { role: "readWrite", db: "adminsyncDB" }
    ]
  });
  
  // Create users collection and insert initial data
  db.users.insertMany([
    {
      email: "iiprofit@mail.com",
      name: "II Profit",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "priyas@mail.com",
      name: "Priya",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  // Create indexes for the users collection
  db.users.createIndex({ email: 1 }, { unique: true });
' 