pipeline {
    agent any
    
    environment {
        AWS_CREDENTIALS = credentials('aws-credentials')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        GITHUB_CREDENTIALS = credentials('github-credentials')
        AWS_REGION=us-east-1
        DOCKER_REGISTRY=iiprofit
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
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build and push backend image
                    sh '''
                        cd app/backend
                        docker build -t iiprofit/capstone-backend:latest --platform linux/amd64 .
                        docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                        docker push iiprofit/capstone-backend:latest
                    '''
                    
                    // Build and push frontend image
                    sh '''
                        cd ../frontend
                        docker build -t iiprofit/capstone-frontend:latest --platform linux/amd64 -f Dockerfile ..
                        docker push iiprofit/capstone-frontend:latest
                    '''
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
        
        stage('Verify Deployment') {
            steps {
                script {
                    // Wait for services to be healthy
                    sh '''
                        sleep 30
                        # Check backend health
                        curl -f http://dev-backend-alb-534485236.us-east-1.elb.amazonaws.com:3000/api/health || exit 1
                        # Check frontend health
                        curl -f http://dev-frontend-alb-534485236.us-east-1.elb.amazonaws.com:80 || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
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