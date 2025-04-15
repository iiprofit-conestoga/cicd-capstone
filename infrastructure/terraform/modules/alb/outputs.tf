output "frontend_alb_id" {
  description = "ID of the frontend ALB"
  value       = aws_lb.frontend.id
}

output "frontend_alb_arn" {
  description = "ARN of the frontend ALB"
  value       = aws_lb.frontend.arn
}

output "frontend_alb_dns_name" {
  description = "DNS name of the frontend ALB"
  value       = aws_lb.frontend.dns_name
}

output "backend_alb_id" {
  description = "ID of the backend ALB"
  value       = aws_lb.backend.id
}

output "backend_alb_arn" {
  description = "ARN of the backend ALB"
  value       = aws_lb.backend.arn
}

output "backend_alb_dns_name" {
  description = "DNS name of the backend ALB"
  value       = aws_lb.backend.dns_name
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
  description = "ARN of the backend target group"
  value       = aws_lb_target_group.backend.arn
} 