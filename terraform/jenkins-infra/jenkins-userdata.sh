#!/bin/bash
# Amazon Linux 2023 setup script
set -e  # Exit on any error

# Update system
dnf update -y
dnf install -y docker git unzip wget

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Install Java 21
dnf install -y java-21-amazon-corretto

# Set Java 21 as default
alternatives --install /usr/bin/java java /usr/lib/jvm/java-21-amazon-corretto/bin/java 1
alternatives --set java /usr/lib/jvm/java-21-amazon-corretto/bin/java

# Set JAVA_HOME globally
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto' >> /etc/environment
echo 'export PATH="/usr/lib/jvm/java-21-amazon-corretto/bin:$PATH"' >> /etc/environment
export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto

# Install Jenkins
wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
dnf install -y jenkins

# Configure Jenkins to use Java 21
echo "JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto" >> /etc/sysconfig/jenkins
echo "JENKINS_JAVA_CMD=/usr/lib/jvm/java-21-amazon-corretto/bin/java" >> /etc/sysconfig/jenkins

# Start and enable Jenkins
systemctl start jenkins
systemctl enable jenkins
usermod -aG docker jenkins

# Install Ansible (using pip3 for AL2023)
dnf install -y python3-pip
pip3 install --upgrade pip
pip3 install ansible

# Install Terraform
dnf install -y dnf-plugins-core
dnf config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
dnf install -y terraform

# Install AWS CLI v2
cd /tmp
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install --update
rm -rf awscliv2.zip aws/

# Install Maven 3.9.6 (compatible with Java 21 and Spring Boot 3.1)
cd /opt
wget -q https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
tar xzf apache-maven-3.9.6-bin.tar.gz
ln -sf apache-maven-3.9.6 maven
chown -R root:root /opt/apache-maven-3.9.6

# Set Maven environment variables
echo 'export M2_HOME=/opt/maven' >> /etc/environment
echo 'export PATH="/opt/maven/bin:$PATH"' >> /etc/environment
export M2_HOME=/opt/maven
export PATH="/opt/maven/bin:$PATH"

# Create Maven symlinks for system-wide access
ln -sf /opt/maven/bin/mvn /usr/local/bin/mvn
ln -sf /opt/maven/bin/mvn /usr/bin/mvn

# Clean up Maven archive
rm -f /opt/apache-maven-3.9.6-bin.tar.gz

# Install Node.js 18 LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# Wait for Jenkins user to be created
sleep 10

# Create SSH directory for jenkins user
mkdir -p /var/lib/jenkins/.ssh
chown jenkins:jenkins /var/lib/jenkins/.ssh
chmod 700 /var/lib/jenkins/.ssh

# Create SSH directory for ec2-user (for manual access)
mkdir -p /home/ec2-user/.ssh
chown ec2-user:ec2-user /home/ec2-user/.ssh
chmod 700 /home/ec2-user/.ssh

# Store private key for Jenkins user
cat > /var/lib/jenkins/.ssh/hotel-booking-key.pem << "PRIVATE_KEY_EOF"
${private_key}
PRIVATE_KEY_EOF

# Store private key for ec2-user
cat > /home/ec2-user/.ssh/hotel-booking-key.pem << "PRIVATE_KEY_EOF"
${private_key}
PRIVATE_KEY_EOF

# Set correct permissions
chmod 600 /var/lib/jenkins/.ssh/hotel-booking-key.pem
chmod 600 /home/ec2-user/.ssh/hotel-booking-key.pem
chown jenkins:jenkins /var/lib/jenkins/.ssh/hotel-booking-key.pem
chown ec2-user:ec2-user /home/ec2-user/.ssh/hotel-booking-key.pem

# Verify installations
echo "=== Installation Verification ==="
java -version
mvn -version
node --version
npm --version
ansible --version
terraform --version
aws --version
docker --version

echo "Jenkins setup completed successfully with Amazon Linux 2023, Java 21, Maven 3.9.6, and SSH key configured"