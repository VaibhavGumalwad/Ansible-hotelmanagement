variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "hotel-booking"
}

variable "key_name" {
  description = "EC2 Key Pair name for SSH"
  default     = "hotel-booking-key"
}
