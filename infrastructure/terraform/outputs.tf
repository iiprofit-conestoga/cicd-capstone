output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "frontend_alb_dns_name" {
  description = "DNS name of the frontend ALB"
  value       = module.alb.frontend_alb_dns_name
}

output "backend_alb_dns_name" {
  description = "DNS name of the backend ALB"
  value       = module.alb.backend_alb_dns_name
}

output "mongodb_private_ip" {
  description = "Private IP address of the MongoDB instance"
  value       = module.mongodb.mongodb_private_ip
}

output "mongodb_connection_string" {
  description = "MongoDB connection string"
  value       = module.mongodb.mongodb_connection_string
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.ecs_cluster_name
}

output "frontend_service_name" {
  description = "Name of the frontend service"
  value       = module.ecs.frontend_service_name
}

output "backend_service_name" {
  description = "Name of the backend service"
  value       = module.ecs.backend_service_name
} 