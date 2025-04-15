resource "aws_ecs_task_definition" "backend" {
  family                   = "dev-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = "256"
  memory                  = "512"
  execution_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn           = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "iiprofit/capstone-backend:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "PORT"
          value = "3000"
        },
        {
          name  = "JWT_SECRET"
          value = "8453e243233549bac3baadb0ad46d4bfa35c733636a4038dccf8fd15d5927169ff43fdf8c4a418e69d95335b9dd30ef57168b92abd50ff2a9bb9607859d9cd54"
        },
        {
          name  = "NODE_ENV"
          value = "dev"
        },
        {
          name  = "MONGODB_URI"
          value = "mongodb://user_iiprofit:499%23Waterloo@185.239.208.33:27017/adminsyncDB?authSource=admin"
        },
        {
          name  = "MONGODB_HOST"
          value = "185.239.208.33"
        },
        {
          name  = "MONGODB_DATABASE"
          value = "adminsyncDB"
        },
        {
          name  = "MONGODB_USER"
          value = "user_iiprofit"
        },
        {
          name  = "MONGODB_PASSWORD"
          value = "499#Waterloo"
        },
        {
          name  = "MONGODB_PORT"
          value = "27017"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/dev"
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "backend"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
      ulimits = [
        {
          name      = "nofile"
          softLimit = 65536
          hardLimit = 65536
        }
      ]
    }
  ])

  tags = {
    Name        = "dev-backend-task"
    Environment = "dev"
  }
} 