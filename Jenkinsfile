pipeline {
    agent any

    environment {
        AWS_REGION      = 'us-east-1'
        ECR_REGISTRY    = credentials('ECR_REGISTRY')       // e.g. 123456789.dkr.ecr.us-east-1.amazonaws.com
        IMAGE_TAG       = "${BUILD_NUMBER}"
        RDS_ENDPOINT    = credentials('RDS_ENDPOINT')       // from Terraform output
        DB_USERNAME     = credentials('DB_USERNAME')
        DB_PASSWORD     = credentials('DB_PASSWORD')
        JWT_SECRET      = credentials('JWT_SECRET')
        APP_SERVER_IP   = credentials('APP_SERVER_IP')      // from Terraform output
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<your-username>/hotel-booking.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('hotel-booking-backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('hotel-booking-frontend') {
                    sh 'npm install && npm run build'
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

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh '''
                        terraform init
                        terraform plan -out=tfplan
                        terraform apply -auto-approve tfplan
                    '''
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                    # Update inventory with actual IP
                    sed -i "s/{{ APP_SERVER_IP }}/${APP_SERVER_IP}/g" ansible/inventory.ini

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
            echo "Deployment successful! App running at http://${APP_SERVER_IP}"
        }
        failure {
            echo "Deployment failed! Check logs above."
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}
