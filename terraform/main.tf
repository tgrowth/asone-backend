provider "aws" {
  region = var.aws_region
}

resource "aws_ecrpublic_repository" "app_repo" {
  repository_name = var.ecr_repo_name
}

locals {
  app_hash = md5(join("", [
    filesha256("${path.root}/../app/server.ts"),
    filesha256("${path.root}/../package.json"),
    filesha256("${path.root}/../package-lock.json")
  ]))
}

resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = <<EOF
      aws ecr-public get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin public.ecr.aws
      docker build -t ${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash} ..
      docker push ${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash}
    EOF
  }

  triggers = {
    app_hash = local.app_hash
  }
}

resource "aws_security_group" "alb_sg" {
  name        = "asone-alb-sg"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "api_lb" {
  name               = "api-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.subnet_ids
}

resource "aws_lb_target_group" "api_tg" {
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" 

  health_check {
    path                = "/health" 
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  deregistration_delay = 30

  lifecycle {
    create_before_destroy = true
  }
}



resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.api_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }

  depends_on = [aws_lb_target_group.api_tg]
}



