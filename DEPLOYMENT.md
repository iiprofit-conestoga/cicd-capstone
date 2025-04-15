# Deployment Guide for AdminSync

This guide provides detailed instructions for building Docker images, pushing them to Docker Hub, and deploying the application to AWS using Terraform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building and Pushing Docker Images](#building-and-pushing-docker-images)
3. [Configuring Terraform](#configuring-terraform)
4. [Deploying to AWS](#deploying-to-aws)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Docker and Docker Compose installed
- A Docker Hub account
- AWS CLI configured with appropriate credentials
- Terraform (v1.0.0 or later) installed
- Access to an AWS account with permissions to create resources

## Building and Pushing Docker Images

### 1. Log in to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### 2. Run the Build and Push Script

We've created a script to automate the process of building and pushing Docker images:

```bash
./build-and-push-images.sh iiprofit
```

This script will:
- Build the frontend Docker image
- Tag it with your Docker Hub username (iiprofit)
- Push it to Docker Hub
- Build the backend Docker image
- Tag it with your Docker Hub username (iiprofit)
- Push it to Docker Hub

### 3. Verify Images in Docker Hub

After the script completes, verify that your images are available in Docker Hub by visiting:
- `https://hub.docker.com/r/iiprofit/capstone-frontend`
- `https://hub.docker.com/r/iiprofit/capstone-backend`

## Configuring Terraform

### 1. Update terraform.tfvars

The `infrastructure/terraform/terraform.tfvars` file has been updated with your Docker Hub username:

```hcl
# Docker Images
frontend_image = "iiprofit/capstone-frontend:latest"
backend_image  = "iiprofit/capstone-backend:latest"
```

### 2. Review Other Configuration Variables

Make sure other variables in `terraform.tfvars` are set correctly:

- `environment`: The environment name (e.g., dev, staging, prod)
- `aws_region`: The AWS region to deploy to
- `key_name`: The name of your EC2 key pair
- `db_username` and `db_password`: MongoDB admin credentials
- `jwt_secret`: A secure secret for JWT token generation

## Deploying to AWS

### 1. Navigate to the Terraform Directory

```bash
cd infrastructure/terraform
```

### 2. Initialize Terraform

```bash
terraform init
```

This will download the necessary providers and modules.

### 3. Review the Deployment Plan

```bash
terraform plan
```

This will show you what resources will be created, updated, or destroyed. Review the plan carefully.

### 4. Apply the Configuration

```bash
terraform apply
```

When prompted, type `yes` to confirm the deployment.

### 5. Access Your Application

After deployment completes, Terraform will output the ALB DNS names for your frontend and backend services. You can access your application using these URLs:

- Frontend: `http://<frontend-alb-dns-name>`
- Backend API: `http://<backend-alb-dns-name>`

## Environment Variables

The ECS task definitions include all necessary environment variables for both frontend and backend services:

### Frontend Environment Variables
- `NODE_ENV`: Set to the environment name (dev, staging, prod)
- `API_URL`: Set to the backend ALB DNS name
- `VITE_API_URL`: Set to the backend ALB DNS name
- `VITE_PORT`: Set to 80

### Backend Environment Variables
- `NODE_ENV`: Set to the environment name (dev, staging, prod)
- `PORT`: Set to 5000
- `MONGODB_URI`: Set to the MongoDB connection URI
- `JWT_SECRET`: Set to the JWT secret
- `MONGODB_DATABASE`: Set to "adminsyncDB"
- `MONGODB_ROOT_USER`: Set to "admin_iiprofit"
- `MONGODB_ROOT_PASSWORD`: Set to "Capstone_2025"
- `MONGODB_USER`: Set to "user_iiprofit"
- `MONGODB_PASSWORD`: Set to "499#Waterloo"
- `MONGODB_HOST`: Extracted from the MongoDB URI
- `MONGODB_PORT`: Set to 27017

## Troubleshooting

### Container Logs

If your containers are not starting or behaving as expected, check the CloudWatch logs:

1. Go to the AWS CloudWatch console
2. Navigate to Log groups
3. Find the log group `/ecs/dev` (or your environment name)
4. Check the logs for the frontend and backend containers

### Network Connectivity

If your containers cannot connect to each other or to external services:

1. Check the security group rules in the AWS VPC console
2. Ensure the ECS tasks are in the correct subnets
3. Verify that the ALB security groups allow traffic on the necessary ports

### Environment Variables

If your application is not receiving the expected environment variables:

1. Check the ECS task definition in the AWS ECS console
2. Verify that the environment variables are correctly set
3. Restart the ECS service to apply any changes

### Scaling Issues

If your application is not scaling as expected:

1. Check the Auto Scaling configuration in the AWS Application Auto Scaling console
2. Verify that the CloudWatch alarms are correctly configured
3. Check the CPU and memory utilization in CloudWatch metrics

## Cleanup

To destroy all resources created by Terraform:

```bash
cd infrastructure/terraform
terraform destroy
```

When prompted, type `yes` to confirm the destruction of resources.

**Note**: This will delete all resources created by Terraform, including databases. Make sure you have backups of any important data before running this command. 