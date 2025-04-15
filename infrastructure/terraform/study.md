# Infrastructure Study Guide

This document summarizes the key infrastructure resources defined in the Terraform configuration, explaining what each module does and why it is used.

---

## 1. VPC Module (`modules/vpc`)
**Purpose:**  
Creates the foundational network infrastructure in AWS.

**Key Resources:**
- **aws_vpc:** The main Virtual Private Cloud, providing an isolated network.
- **aws_subnet (public/private):** Subdivides the VPC into public and private subnets for organizing resources and controlling access.
- **aws_internet_gateway:** Allows resources in public subnets to access the internet.
- **aws_nat_gateway & aws_eip:** Enables instances in private subnets to access the internet securely.
- **aws_route_table & associations:** Manages routing for public/private subnets.
- **aws_security_group (alb, ecs, rds):** Controls inbound/outbound traffic for ALB, ECS, and database resources.

**Why:**  
A VPC is essential for securely isolating and managing your AWS resources, controlling traffic, and enabling both public and private networking.

---

## 2. ALB Module (`modules/alb`)
**Purpose:**  
Sets up Application Load Balancers for frontend and backend services.

**Key Resources:**
- **aws_lb (frontend/backend):** Distributes incoming traffic to ECS services.
- **aws_lb_target_group (frontend/backend):** Groups ECS tasks for load balancing.
- **aws_lb_listener (frontend/backend):** Listens for traffic on specific ports and forwards to target groups.
- **aws_cloudwatch_log_group:** Stores ALB access logs for monitoring and troubleshooting.

**Why:**  
ALBs provide scalable, highly available entry points for your applications, supporting health checks and traffic routing.

---

## 3. MongoDB Module (`modules/mongodb`)
**Purpose:**  
Deploys a MongoDB instance on an EC2 VM in a private subnet.

**Key Resources:**
- **aws_instance:** The EC2 VM running MongoDB.
- **aws_security_group:** Restricts access to MongoDB, allowing only ECS tasks to connect.
- **aws_cloudwatch_log_group:** For logging MongoDB-related events.

**Why:**  
A managed, private MongoDB instance is required for your application's data storage, with security and initialization handled automatically.

---

## 4. ECS Module (`modules/ecs`)
**Purpose:**  
Defines the container orchestration platform for running your frontend and backend services.

**Key Resources:**
- **aws_ecs_cluster:** The ECS cluster to run containers.
- **aws_ecs_task_definition (frontend/backend):** Describes how to run your containers (images, resources, environment).
- **aws_ecs_service (frontend/backend):** Manages running and scaling containers.
- **aws_iam_role & policies:** Grants ECS tasks permissions to interact with AWS services.
- **aws_cloudwatch_log_group:** Centralizes logs from containers.
- **aws_appautoscaling_target & policy:** Enables auto-scaling of services based on CPU/memory.
- **aws_cloudwatch_metric_alarm:** Triggers scaling actions based on resource usage.

**Why:**  
ECS provides scalable, managed container orchestration, allowing you to deploy, scale, and manage Docker containers easily.

---

## 5. Other Files
- **variables.tf / outputs.tf:** Define input variables and output values for each module.
- **terraform.tfvars / .example:** Store actual values for variables (like region, subnet CIDRs, credentials).
- **terraform.tfstate / .backup:** Track the current state of your infrastructure (do not edit manually).
- **.terraform.lock.hcl:** Locks provider versions for reproducible builds.
- **load-env.sh:** Helper script for loading environment variables.

---

## Summary Table

| Module   | Main Resources | Why Used |
|----------|----------------|----------|
| vpc      | VPC, subnets, gateways, security groups | Secure, isolated networking |
| alb      | Load balancers, target groups, listeners | Scalable, reliable traffic routing |
| mongodb  | EC2 instance, security group | Managed, private database |
| ecs      | ECS cluster, task/service definitions, IAM, scaling | Container orchestration and scaling |

---

If you want a deep dive into any specific resource or module, refer to the corresponding module folder or ask for more details! 