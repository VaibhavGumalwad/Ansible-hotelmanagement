resource "tls_private_key" "jenkins_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "jenkins_key" {
  key_name   = var.key_name
  public_key = tls_private_key.jenkins_key.public_key_openssh

  tags = {
    Name = "${var.project_name}-key-pair"
  }
}

# Store private key in Jenkins server during user_data execution
resource "local_file" "jenkins_private_key" {
  content  = tls_private_key.jenkins_key.private_key_pem
  filename = "${path.module}/hotel-booking-key.pem"
  file_permission = "0600"
}