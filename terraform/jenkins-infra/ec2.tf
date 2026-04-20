data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "jenkins_server" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.medium"
  subnet_id              = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]
  key_name               = var.key_name
  monitoring             = true

  root_block_device {
    volume_type = "gp3"
    volume_size = 30
    encrypted   = true
    delete_on_termination = true
  }

  user_data = base64encode(templatefile("${path.module}/jenkins-userdata.sh", {
    private_key = tls_private_key.jenkins_key.private_key_pem
  }))

  tags = { Name = "${var.project_name}-jenkins-server" }
}
