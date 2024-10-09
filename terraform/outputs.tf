output "ecr_repository_uri" {
  value = aws_ecrpublic_repository.app_repo.repository_uri
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.main.name
}

output "alb_dns_name" {
  value = aws_lb.api_lb.dns_name
}
