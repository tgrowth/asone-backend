resource "aws_ecs_cluster" "main" {
  name = var.ecs_cluster_name
}

resource "aws_ecs_task_definition" "app" {
  family                   = "asone"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "1024"
  memory                   = "3072"

  container_definitions = jsonencode([{
    name  = "app"
    image = "${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash}"
    portMappings = [{
      containerPort = var.container_port
      hostPort      = var.container_port
    }]
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
    subnets          = ["subnet-0b086c04e9706ab09"]
    assign_public_ip = true
    security_groups  = ["sg-065391f552ab937fc"]
  }
}