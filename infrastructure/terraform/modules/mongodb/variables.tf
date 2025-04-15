variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ID of the ECS security group"
  type        = string
}

variable "ami_id" {
  description = "AMI ID for the MongoDB instance (Ubuntu 20.04 LTS)"
  type        = string
  default     = "ami-0c7217cdde317cfec"  # Ubuntu 20.04 LTS in us-east-1
}

variable "instance_type" {
  description = "EC2 instance type for MongoDB"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair to use for the instance"
  type        = string
}

variable "db_username" {
  description = "Username for MongoDB admin user"
  type        = string
}

variable "db_password" {
  description = "Password for MongoDB admin user"
  type        = string
  sensitive   = true
} 