variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ID of the ECS security group"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  type        = string
}

variable "backend_target_group_arn" {
  description = "ARN of the backend target group"
  type        = string
}

variable "frontend_image" {
  description = "Docker image for the frontend"
  type        = string
}

variable "backend_image" {
  description = "Docker image for the backend"
  type        = string
}

variable "frontend_cpu" {
  description = "CPU units for the frontend task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory for the frontend task (MiB)"
  type        = number
  default     = 512
}

variable "backend_cpu" {
  description = "CPU units for the backend task"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory for the backend task (MiB)"
  type        = number
  default     = 512
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 1
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 1
}

variable "frontend_min_capacity" {
  description = "Minimum capacity for frontend auto scaling"
  type        = number
  default     = 1
}

variable "frontend_max_capacity" {
  description = "Maximum capacity for frontend auto scaling"
  type        = number
  default     = 5
}

variable "backend_min_capacity" {
  description = "Minimum capacity for backend auto scaling"
  type        = number
  default     = 1
}

variable "backend_max_capacity" {
  description = "Maximum capacity for backend auto scaling"
  type        = number
  default     = 5
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
}

variable "backend_url" {
  description = "Backend API URL"
  type        = string
}

variable "backend_alb_dns_name" {
  description = "The DNS name of the backend ALB"
  type        = string
}

variable "mongodb_private_ip" {
  description = "The private IP address of the MongoDB instance"
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