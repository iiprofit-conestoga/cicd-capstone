resource "aws_instance" "mongodb" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.private_subnet_ids[0]  # Using first private subnet
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.mongodb.id]

  user_data = <<-EOF
              #!/bin/bash
              # Install MongoDB
              wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
              echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
              sudo apt-get update
              sudo apt-get install -y mongodb-org

              # Start MongoDB
              sudo systemctl start mongod
              sudo systemctl enable mongod

              # Create MongoDB root user
              mongosh admin --eval '
                db.createUser({
                  user: "${var.db_username}",
                  pwd: "${var.db_password}",
                  roles: [ { role: "root", db: "admin" } ]
                })
              '

              # Configure MongoDB to listen on all interfaces
              sudo sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf
              sudo systemctl restart mongod

              # Create initialization script
              cat > /tmp/init-mongodb.sh << 'INITSCRIPT'
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
              INITSCRIPT

              # Make the script executable and run it
              chmod +x /tmp/init-mongodb.sh
              /tmp/init-mongodb.sh
              EOF

  tags = {
    Name        = "${var.environment}-mongodb"
    Environment = var.environment
  }
}

resource "aws_security_group" "mongodb" {
  name        = "${var.environment}-mongodb-sg"
  description = "Security group for MongoDB instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [var.ecs_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.environment}-mongodb-sg"
    Environment = var.environment
  }
}

# CloudWatch Log Group for MongoDB
resource "aws_cloudwatch_log_group" "mongodb" {
  name              = "/aws/mongodb/${var.environment}"
  retention_in_days = 30

  tags = {
    Name        = "${var.environment}-mongodb-logs"
    Environment = var.environment
  }
} 