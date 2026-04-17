# Generate private key
resource "tls_private_key" "hotel_booking_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Create AWS key pair
resource "aws_key_pair" "hotel_booking_key" {
  key_name   = "${var.project_name}-key"
  public_key = tls_private_key.hotel_booking_key.public_key_openssh

  tags = {
    Name = "${var.project_name}-keypair"
  }
}

# Store private key in AWS Systems Manager Parameter Store
resource "aws_ssm_parameter" "private_key" {
  name  = "/${var.project_name}/ssh-key/private"
  type  = "SecureString"
  value = tls_private_key.hotel_booking_key.private_key_pem

  tags = {
    Name = "${var.project_name}-private-key"
  }
}