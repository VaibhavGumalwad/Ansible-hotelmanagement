#!/bin/bash
yum update -y
yum install -y docker git

systemctl start docker
systemctl enable docker

# Install Java 21
yum install -y java-21-amazon-corretto

# Set Java 21 as default
alternatives --install /usr/bin/java java /usr/lib/jvm/java-21-amazon-corretto/bin/java 1
alternatives --set java /usr/lib/jvm/java-21-amazon-corretto/bin/java

# Set JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto' >> /etc/environment
export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto

# Install Jenkins
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
yum install -y jenkins

# Configure Jenkins to use Java 21
echo 'JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto' >> /etc/sysconfig/jenkins
echo 'JENKINS_JAVA_CMD=/usr/lib/jvm/java-21-amazon-corretto/bin/java' >> /etc/sysconfig/jenkins

systemctl start jenkins
systemctl enable jenkins
usermod -aG docker jenkins

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

# Create SSH directory for jenkins user
mkdir -p /var/lib/jenkins/.ssh
chown jenkins:jenkins /var/lib/jenkins/.ssh
chmod 700 /var/lib/jenkins/.ssh

# Create SSH directory for ec2-user (for manual access)
mkdir -p /home/ec2-user/.ssh
chown ec2-user:ec2-user /home/ec2-user/.ssh
chmod 700 /home/ec2-user/.ssh

# Store private key for Jenkins user
cat > /var/lib/jenkins/.ssh/hotel-booking-key.pem << 'PRIVATE_KEY_EOF'
${private_key}
PRIVATE_KEY_EOF

# Store private key for ec2-user
cat > /home/ec2-user/.ssh/hotel-booking-key.pem << 'PRIVATE_KEY_EOF'
${private_key}
PRIVATE_KEY_EOF

# Set correct permissions
chmod 600 /var/lib/jenkins/.ssh/hotel-booking-key.pem
chmod 600 /home/ec2-user/.ssh/hotel-booking-key.pem
chown jenkins:jenkins /var/lib/jenkins/.ssh/hotel-booking-key.pem
chown ec2-user:ec2-user /home/ec2-user/.ssh/hotel-booking-key.pem

# Verify Java version
java -version

echo "Jenkins setup completed with Java 21 and SSH key configured"