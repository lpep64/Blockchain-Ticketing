#!/bin/bash

# This code creates a VPC (virtual private cloud) for our VM to run on. 


VPC_NAME="blockchain-devnet-vpc"
SUBNET_NAME="subnet"
REGION="us-central1"
SUBNET_RANGE="10.0.0.0/24"
FIREWALL_RULE="allow-ganache"

echo "Creating VPC: $VPC_NAME..."
gcloud compute networks create $VPC_NAME \
    --subnet-mode=custom

echo "Creating subnet: $SUBNET_NAME in $REGION..."
gcloud compute networks subnets create $SUBNET_NAME \
    --network=$VPC_NAME \
    --range=$SUBNET_RANGE \
    --region=$REGION

echo "Allowing SSH access..."
gcloud compute firewall-rules create allow-ssh \
    --network=$VPC_NAME \
    --allow=tcp:22

echo "Allowing Ganache (port 8545) access..."
gcloud compute firewall-rules create $FIREWALL_RULE \
    --network=$VPC_NAME \
    --allow=tcp:8545 \
    --source-ranges=0.0.0.0/0 \
    --description="Allow external access to Ganache"

echo "VPC Setup Complete!"