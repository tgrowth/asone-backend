resource "aws_ecs_cluster" "main" {
  name = var.ecs_cluster_name
}

resource "aws_security_group" "ecs_sg" {
  name        = "asone-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_ecs_task_definition" "app" {
  family                   = "asone"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "3072"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn 

  container_definitions = jsonencode([{
       name  = "app"
       image = "${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash}"
       portMappings = [{
         containerPort = var.container_port
         hostPort      = var.container_port
       }]
       logConfiguration = {
         logDriver = "awslogs"
         options = {
           awslogs-group         = "/ecs/asone"
           awslogs-region        = var.aws_region
           awslogs-stream-prefix = "ecs"
         }
       }
       environment = [
         {
           name  = "DB_HOST"
           value = aws_db_instance.postgres.address
         },
         {
           name  = "DB_PORT"
           value = "5432"
         },
         {
           name  = "DB_USERNAME"
           value = var.db_username
         },
         {
           name  = "DB_PASSWORD"
           value = var.db_password
         },
         {
           name  = "DB_DATABASE"
           value = var.db_name
         }
       ]
     }])


  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }

  depends_on = [null_resource.docker_push]
}

resource "aws_ecs_service" "main" {
  name            = var.ecs_service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    assign_public_ip = true  
    security_groups  = [aws_security_group.ecs_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api_tg.arn
    container_name   = "app"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http_listener]
}
