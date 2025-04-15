resource "aws_instance" "mongodb" {
  ami           = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  
  subnet_id              = aws_subnet.private_subnet_1.id
  vpc_security_group_ids = [aws_security_group.mongodb_sg.id]
  
  tags = {
    Name = "dev-mongodb"
  }

  user_data = <<-EOF
              #!/bin/bash
              exec > >(tee /var/log/user-data.log) 2>&1
              echo "Starting Docker and MongoDB installation..."
              
              # Update package list
              echo "Updating package list..."
              apt-get update || {
                echo "Failed to update package list"
                exit 1
              }
              
              # Install required dependencies
              echo "Installing dependencies..."
              apt-get install -y \
                  apt-transport-https \
                  ca-certificates \
                  curl \
                  gnupg \
                  lsb-release \
                  software-properties-common || {
                echo "Failed to install dependencies"
                exit 1
              }
              
              # Add Docker's official GPG key
              echo "Adding Docker GPG key..."
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg || {
                echo "Failed to add Docker GPG key"
                exit 1
              }
              
              # Add Docker repository
              echo "Adding Docker repository..."
              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null || {
                echo "Failed to add Docker repository"
                exit 1
              }
              
              # Update package list again
              echo "Updating package list for Docker..."
              apt-get update || {
                echo "Failed to update package list for Docker"
                exit 1
              }
              
              # Install Docker
              echo "Installing Docker..."
              apt-get install -y docker-ce docker-ce-cli containerd.io || {
                echo "Failed to install Docker"
                exit 1
              }
              
              # Start Docker service
              echo "Starting Docker service..."
              systemctl start docker || {
                echo "Failed to start Docker service"
                systemctl status docker
                exit 1
              }
              systemctl enable docker || {
                echo "Failed to enable Docker service"
                exit 1
              }
              
              # Create data directory for MongoDB
              echo "Creating data directory..."
              mkdir -p /data/db
              chmod 777 /data/db
              
              # Pull MongoDB image
              echo "Pulling MongoDB image..."
              docker pull mongo:6.0 || {
                echo "Failed to pull MongoDB image"
                exit 1
              }
              
              # Run MongoDB container
              echo "Starting MongoDB container..."
              docker run -d \
                --name mongodb \
                --restart always \
                -p 27017:27017 \
                -v /data/db:/data/db \
                -e MONGO_INITDB_ROOT_USERNAME=admin \
                -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
                mongo:6.0 || {
                  echo "Failed to start MongoDB container"
                  docker logs mongodb
                  exit 1
                }
              
              # Wait for MongoDB to be ready
              echo "Waiting for MongoDB to be ready..."
              timeout=300  # 5 minutes timeout
              counter=0
              while ! docker exec mongodb mongosh --eval "print(\"MongoDB is running\")" > /dev/null 2>&1; do
                if [ $counter -ge $timeout ]; then
                  echo "Timeout waiting for MongoDB to start"
                  docker logs mongodb
                  exit 1
                fi
                echo "Waiting for MongoDB to start... ($counter seconds)"
                sleep 2
                counter=$((counter + 2))
              done
              
              echo "MongoDB installation and configuration completed successfully!"
              EOF
}

resource "aws_security_group" "mongodb_sg" {
  name        = "dev-mongodb-sg"
  description = "Security group for MongoDB (demonstration only)"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # Allow access from within the VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "dev-mongodb-sg"
  }
}

# CloudWatch log group for MongoDB (demonstration only)
resource "aws_cloudwatch_log_group" "mongodb" {
  name              = "/aws/mongodb/dev"
  retention_in_days = 30

  tags = {
    Environment = "dev"
    Name        = "dev-mongodb-logs"
  }
} 