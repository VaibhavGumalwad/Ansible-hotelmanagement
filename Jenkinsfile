pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        AWS_REGION      = 'us-east-1'
        // ECR_REGISTRY is captured dynamically from terraform output after infra is created
        IMAGE_TAG       = "${BUILD_NUMBER}"
        // These are used ONLY to pass into Terraform for RDS creation
        TF_DB_USERNAME  = credentials('DB_USERNAME')
        TF_DB_PASSWORD  = credentials('DB_PASSWORD')
        // RDS_ENDPOINT, DB_USERNAME, DB_PASSWORD are captured dynamically from terraform output after infra is created
        JWT_SECRET      = credentials('JWT_SECRET')
        // APP_SERVER_IP is captured dynamically from terraform output after infra is created
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/VaibhavGumalwad/Ansible-hotelmanagement.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('hotel-booking-backend') {
                    sh '''
                        echo "Using Maven:"
                        mvn -version
                        mvn clean package -DskipTests
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('hotel-booking-frontend') {
                    sh '''
                        # Fix npm permissions and clean install
                        rm -rf node_modules package-lock.json
                        npm cache clean --force
                        npm install
                        
                        # Fix executable permissions
                        chmod +x node_modules/.bin/*
                        
                        # Build the project
                        npm run build
                    '''
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform/app-infra') {
                    sh '''
                        terraform init
                        terraform plan -out=tfplan \
                            -var="db_username=${TF_DB_USERNAME}" \
                            -var="db_password=${TF_DB_PASSWORD}"
                        terraform apply -auto-approve tfplan
                    '''
                    // Capture outputs dynamically from terraform
                    script {
                        env.APP_SERVER_IP = sh(
                            script: 'terraform output -raw app_server_public_ip',
                            returnStdout: true
                        ).trim()
                        env.RDS_ENDPOINT = sh(
                            script: 'terraform output -raw rds_endpoint',
                            returnStdout: true
                        ).trim()
                        env.DB_USERNAME = sh(
                            script: 'terraform output -raw db_username',
                            returnStdout: true
                        ).trim()
                        env.DB_PASSWORD = sh(
                            script: 'terraform output -raw db_password',
                            returnStdout: true
                        ).trim()
                        env.ECR_REGISTRY = sh(
                            script: 'terraform output -raw ecr_registry',
                            returnStdout: true
                        ).trim()
                        env.PRIVATE_KEY_FILE = sh(
                            script: 'terraform output -raw private_key_file',
                            returnStdout: true
                        ).trim()
                        echo "App Server IP: ${env.APP_SERVER_IP}"
                        echo "RDS Endpoint: ${env.RDS_ENDPOINT}"
                        echo "DB Username: ${env.DB_USERNAME}"
                        echo "DB Password: [HIDDEN]"
                        echo "ECR Registry: ${env.ECR_REGISTRY}"
                        echo "Private Key File: ${env.PRIVATE_KEY_FILE}"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t hotel-booking-backend:${IMAGE_TAG} ./hotel-booking-backend
                    docker build -t hotel-booking-frontend:${IMAGE_TAG} ./hotel-booking-frontend
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region ${AWS_REGION} | \
                    docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    docker tag hotel-booking-backend:${IMAGE_TAG} ${ECR_REGISTRY}/hotel-booking-backend:${IMAGE_TAG}
                    docker tag hotel-booking-frontend:${IMAGE_TAG} ${ECR_REGISTRY}/hotel-booking-frontend:${IMAGE_TAG}

                    docker push ${ECR_REGISTRY}/hotel-booking-backend:${IMAGE_TAG}
                    docker push ${ECR_REGISTRY}/hotel-booking-frontend:${IMAGE_TAG}
                '''
            }
        }

        stage('Setup SSH Key') {
            steps {
                sh '''
                    # SSH key is already available from EC2 user_data setup
                    # Just verify it exists and has correct permissions
                    ls -la ~/.ssh/hotel-booking-key.pem
                    chmod 600 ~/.ssh/hotel-booking-key.pem
                    echo "SSH key verified and ready"
                '''
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                    # Overwrite inventory file dynamically with real IP from terraform output
                    cat > ansible/inventory.ini <<EOF
[app_servers]
app_server ansible_host=${APP_SERVER_IP} ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/hotel-booking-key.pem

[jenkins]
jenkins_server ansible_host=${APP_SERVER_IP} ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/hotel-booking-key.pem
EOF

                    # Run Ansible playbook
                    ansible-playbook -i ansible/inventory.ini ansible/deploy.yml \
                        --extra-vars "ecr_registry=${ECR_REGISTRY} \
                                      image_tag=${IMAGE_TAG} \
                                      rds_endpoint=${RDS_ENDPOINT} \
                                      db_username=${DB_USERNAME} \
                                      db_password=${DB_PASSWORD} \
                                      jwt_secret=${JWT_SECRET}"
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 30
                    curl -f http://${APP_SERVER_IP}:8080/api/hotels/all || exit 1
                    echo "Backend is healthy!"
                    curl -f http://${APP_SERVER_IP}:3000 || exit 1
                    echo "Frontend is healthy!"
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful! App running at http://${env.APP_SERVER_IP}"
        }
        failure {
            echo "Deployment failed! Check logs above."
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}
