data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
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

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker git
    systemctl start docker
    systemctl enable docker
    
    # Install Ansible
    amazon-linux-extras install -y ansible2
    # Install Terraform
    yum install -y yum-utils
    yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
    yum install -y terraform
    # Install AWS CLI
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install
    # Install Maven
    yum install -y maven
    # Install Node.js
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
  EOF

  tags = { Name = "${var.project_name}-jenkins-server" }
}
