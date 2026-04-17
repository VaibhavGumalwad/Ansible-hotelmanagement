variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "hotel-booking"
}

variable "instance_type" {
  default = "t3.medium"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  description = "RDS master password - passed in from Jenkins credentials at runtime"
  sensitive   = true
  # No default - must be supplied via -var flag in Jenkins pipeline
}


