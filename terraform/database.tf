resource "aws_db_subnet_group" "asone_db_subnet" {
  name       = "asone-db-subnet-group"
  subnet_ids = var.public_subnet_ids

  tags = {
    Name = "asone-db-subnet-group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "asone-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow PostgreSQL traffic from anywhere"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "asone-postgres-db"
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  username                = var.db_username
  password                = var.db_password
  parameter_group_name    = "default.postgres16"
  skip_final_snapshot     = true
  publicly_accessible     = true
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  db_subnet_group_name    = aws_db_subnet_group.asone_db_subnet.id 

  tags = {
    Name = "asone-postgres-db"
  }
}
