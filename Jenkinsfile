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
        
        stage('Install Node.js') {
            steps {
                sh '''
                    if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
                        export NVM_DIR="$HOME/.nvm"
                        if [ ! -d "$NVM_DIR" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
                        fi
                        . "$NVM_DIR/nvm.sh"
                        nvm install 18
                    fi
                    node -v
                    npm -v
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use 18
                    npm install -g pnpm@10.7.0
                    pnpm install --frozen-lockfile
                '''
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
                        echo "Using BACKEND_URL: $BACKEND_URL"
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