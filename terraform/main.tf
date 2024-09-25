provider "aws" {
  region = var.aws_region
}

resource "aws_ecrpublic_repository" "app_repo" {
  repository_name = var.ecr_repo_name
}


locals {
  app_hash = filemd5("${path.root}/../app/server.js")
}



resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = <<EOF
      aws ecr-public get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin public.ecr.aws
      docker build -t ${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash} ../app
      docker push ${aws_ecrpublic_repository.app_repo.repository_uri}:${local.app_hash}
    EOF
  }

  triggers = {
    app_hash = local.app_hash
  }
}





