#!/bin/bash

# Load environment variables from .env file
if [ -f ../../.env ]; then
    export $(cat ../../.env | grep -v '^#' | xargs)
    
    # Set Terraform variables
    export TF_VAR_jwt_secret="$JWT_SECRET"
    export TF_VAR_db_username="$MONGODB_ROOT_USER"
    export TF_VAR_db_password="$MONGODB_ROOT_PASSWORD"
    
    echo "Environment variables loaded successfully!"
else
    echo "Error: .env file not found!"
    exit 1
fi 