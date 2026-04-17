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

resource "aws_ssm_parameter" "jenkins_private_key" {
  name  = "/${var.project_name}/jenkins-private-key"
  type  = "SecureString"
  value = tls_private_key.jenkins_key.private_key_pem

  tags = {
    Name = "${var.project_name}-jenkins-private-key"
  }
}