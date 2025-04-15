pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        GITHUB_CREDENTIALS = credentials('github-credentials')
        AWS_REGION = 'us-east-1'
        DOCKER_REGISTRY = 'iiprofit'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install -g pnpm@10.7.0'
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('app/backend') {
                            sh 'pnpm test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('app/frontend') {
                            sh 'pnpm test'
                        }
                    }
                }
            }
        }
        
        stage('Infrastructure Check') {
            steps {
                dir('infrastructure/terraform') {
                    sh '''
                        terraform init
                        terraform plan -out=tfplan
                    '''
                }
            }
        }
        
        stage('Deploy Infrastructure') {
            steps {
                dir('infrastructure/terraform') {
                    sh '''
                        terraform apply -auto-approve
                    '''
                }
            }
        }
        
        stage('Get Backend URL') {
            steps {
                dir('infrastructure/terraform') {
                    script {
                        // Get the backend ALB DNS name from Terraform output
                        env.BACKEND_URL = sh(
                            script: 'terraform output -raw backend_alb_dns_name',
                            returnStdout: true
                        ).trim()
                        // Construct the full backend URL
                        env.BACKEND_URL = "http://${env.BACKEND_URL}:3000"
                        echo "Backend URL: ${env.BACKEND_URL}"
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build and push backend image
                    sh '''
                        cd app/backend
                        docker build -t iiprofit/capstone-backend:latest --platform linux/amd64 .
                        docker login -u $DOCKER_CREDENTIALS_USR -p $DOCKER_CREDENTIALS_PSW
                        docker push iiprofit/capstone-backend:latest
                    '''
                    
                    // Build and push frontend image
                    sh '''
                        cd ../frontend
                        docker build -t iiprofit/capstone-frontend:latest --platform linux/amd64 \
                            --build-arg VITE_API_URL=$BACKEND_URL \
                            -f Dockerfile ..
                        docker push iiprofit/capstone-frontend:latest
                    '''
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Wait for services to be healthy
                    sh '''
                        sleep 30
                        # Check backend health
                        curl -f $BACKEND_URL/api/health || exit 1
                        # Get frontend ALB DNS name from Terraform output
                        FRONTEND_URL="http://$(cd infrastructure/terraform && terraform output -raw frontend_alb_dns_name):80"
                        # Check frontend health
                        curl -f $FRONTEND_URL || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        always {
            node {
                cleanWs()
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification steps here (email, Slack, etc.)
        }
    }
} 