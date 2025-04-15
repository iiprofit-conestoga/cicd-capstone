# AWS MongoDB EC2 Module

This Terraform module creates a MongoDB instance running on EC2 with associated resources.

## Features

- Creates an EC2 instance with MongoDB installed and configured
- Sets up security groups for MongoDB access
- Configures CloudWatch logging
- Automatic MongoDB installation and configuration via user data
- Secure password management
- MongoDB authentication enabled

## Usage

```hcl
module "mongodb" {
  source = "./modules/mongodb"

  environment           = "production"
  vpc_id               = "vpc-12345678"
  private_subnet_ids   = ["subnet-12345678", "subnet-87654321"]
  ecs_security_group_id = "sg-12345678"
  key_name             = "my-key-pair"
  db_username          = "admin"
  db_password          = "your-secure-password"
}
```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| environment | Environment name (e.g., production, staging) | string | n/a | yes |
| vpc_id | ID of the VPC | string | n/a | yes |
| private_subnet_ids | List of private subnet IDs | list(string) | n/a | yes |
| ecs_security_group_id | ID of the ECS security group | string | n/a | yes |
| ami_id | AMI ID for the MongoDB instance | string | Ubuntu 20.04 LTS | no |
| instance_type | EC2 instance type | string | t3.micro | no |
| key_name | Name of the SSH key pair | string | n/a | yes |
| db_username | MongoDB admin username | string | n/a | yes |
| db_password | MongoDB admin password | string | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| mongodb_instance_id | ID of the MongoDB EC2 instance |
| mongodb_private_ip | Private IP address of the MongoDB instance |
| mongodb_security_group_id | ID of the MongoDB security group |
| mongodb_connection_string | MongoDB connection string (sensitive) |

## Notes

- The module uses Ubuntu 20.04 LTS as the base AMI
- MongoDB 6.0 is installed automatically
- The instance is placed in a private subnet
- Security group allows access from ECS tasks only
- CloudWatch logs are enabled with 30-day retention
- MongoDB authentication is enabled by default
- The instance is accessible only within the VPC 