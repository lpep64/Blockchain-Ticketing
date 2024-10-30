// Code not complete

//get the credential data from service accout to create nodes
import dotenv from 'dotenv'; // Use import statement for dotenv
dotenv.config(); // Load environment variables from .env file

const credentials_path = process.env.VUE_APP_GOOGLE_APP_CRED; // Credentials to use the service account to create blockchain nodes

import fs from 'fs';

let credential_data;

try {
    credential_data = fs.readFileSync(credentials_path, 'utf8'); // file contents as text
  } catch (err) {
    console.error('Error reading file:', err);
  }
//if credential data was accessed sucessfully, it is stores in JSON format in credential_data

import axios from 'axios'; // Allows the use of HTTP requests for API usage

import computePackage from '@google-cloud/compute'; // Allows for interaction with google cloud compute engine
const { Compute } = computePackage;

//Node setup
import { execSync } from 'child_process';
const accessToken = execSync('gcloud auth print-access-token').toString().trim();

const projectId = 'blockchainticketing';
const location = 'us-central1';

//Setting up first node
const nodeName1 = 'Node-1';
const url1 = `https://blockchainnodeengine.googleapis.com/v1/projects/${projectId}/locations/${location}/blockchainNodes?blockchain_node_id=${nodeName1}`;


const request1_data = {
    blockchainType: "ETHEREUM",
    privateServiceConnectEnabled: false,
    ethereumDetails: {
      consensusClient: "LIGHTHOUSE",
      executionClient: "GETH",
      apiEnableAdmin: false,
      apiEnableDebug: false,
      network: "mainnet",
      nodeType: "full"
    },
    labels: {
      environment: "development"
    }
  };

axios.post(url1, request1_data, {
headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
}
})
.then(response => {
console.log('Response:', response.data);
})
.catch(error => {
console.error('Error:', error.response ? error.response.data : error.message);
});
//first node complete
