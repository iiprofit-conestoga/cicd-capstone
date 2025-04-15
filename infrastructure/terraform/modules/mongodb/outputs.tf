output "mongodb_instance_id" {
  description = "ID of the MongoDB EC2 instance"
  value       = aws_instance.mongodb.id
}

output "mongodb_private_ip" {
  description = "Private IP address of the MongoDB instance"
  value       = aws_instance.mongodb.private_ip
}

output "mongodb_security_group_id" {
  description = "ID of the MongoDB security group"
  value       = aws_security_group.mongodb.id
}

output "mongodb_connection_string" {
  description = "MongoDB connection string"
  value       = "mongodb://${var.db_username}:${var.db_password}@${aws_instance.mongodb.private_ip}:27017/admin?authSource=admin"
  sensitive   = true
} 