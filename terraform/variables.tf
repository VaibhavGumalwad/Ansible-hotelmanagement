variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "hotel-booking"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  default     = "Hotel12345"
  sensitive   = true
}

variable "key_name" {
  description = "EC2 Key Pair name for SSH"
  default     = "hotel-booking-key"
}
