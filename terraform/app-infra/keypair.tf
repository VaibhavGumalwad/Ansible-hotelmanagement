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

# Store private key locally for reference
resource "local_file" "private_key" {
  content  = tls_private_key.hotel_booking_key.private_key_pem
  filename = "${path.module}/hotel-booking-key.pem"
  file_permission = "0600"
}