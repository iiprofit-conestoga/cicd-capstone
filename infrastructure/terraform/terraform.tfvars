# Environment
environment = "dev"

# AWS Region
aws_region = "us-east-1"

# VPC Configuration
vpc_cidr             = "10.0.0.0/16"
availability_zones   = ["us-east-1a", "us-east-1b", "us-east-1c"]
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
private_subnet_cidrs = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]

# EC2 Key Pair
key_name = "capstone-key-pair"  # Default key pair name, change if needed

# MongoDB Configuration
db_username = "admin_iiprofit"
db_password = "Capstone_2025"

# Docker Images
frontend_image = "iiprofit/capstone-frontend:latest"  # Your Docker Hub username
backend_image  = "iiprofit/capstone-backend:latest"   # Your Docker Hub username

# JWT Configuration
jwt_secret = "8453e243233549bac3baadb0ad46d4bfa35c733636a4038dccf8fd15d5927169ff43fdf8c4a418e69d95335b9dd30ef57168b92abd50ff2a9bb9607859d9cd54" 