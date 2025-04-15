terraform {
  backend "s3" {
    bucket = "ksolanki6269-iac-backup"
    key    = "capstone/terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"

  environment           = var.environment
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# ALB Module
module "alb" {
  source = "./modules/alb"

  environment             = var.environment
  vpc_id                 = module.vpc.vpc_id
  public_subnet_ids      = module.vpc.public_subnet_ids
  private_subnet_ids     = module.vpc.private_subnet_ids
  alb_security_group_id  = module.vpc.alb_security_group_id
}

# MongoDB Module
module "mongodb" {
  source = "./modules/mongodb"

  environment           = var.environment
  vpc_id               = module.vpc.vpc_id
  private_subnet_ids   = module.vpc.private_subnet_ids
  ecs_security_group_id = module.vpc.ecs_security_group_id
  key_name             = var.key_name
  db_username          = var.db_username
  db_password          = var.db_password
}

# ECS Module
module "ecs" {
  source = "./modules/ecs"

  environment             = var.environment
  aws_region             = var.aws_region
  private_subnet_ids     = module.vpc.private_subnet_ids
  ecs_security_group_id  = module.vpc.ecs_security_group_id
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  backend_target_group_arn  = module.alb.backend_target_group_arn
  frontend_image         = var.frontend_image
  backend_image          = var.backend_image
  backend_url            = "http://${module.alb.backend_alb_dns_name}"
  mongodb_uri            = module.mongodb.mongodb_connection_string
  jwt_secret             = var.jwt_secret
  backend_alb_dns_name   = module.alb.backend_alb_dns_name
  mongodb_private_ip     = module.mongodb.mongodb_private_ip
  db_username            = var.db_username
  db_password            = var.db_password
} 