import axios from 'axios'; // Allows the use of HTTP requests for API usage
import computePackage from '@google-cloud/compute'; // Allows for interaction with google cloud compute engine
import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process

const NODE_COUNT = 3;


//Node setup
const { Compute } = computePackage;
const accessToken = execSync('gcloud auth print-access-token').toString().trim(); // Receive acess toten through a subprocess
const projectId = 'blockchainticketing';
const location = 'us-central1';

// Sets up count number of nodes
function makeNodes(count){
  for (let i = 1; i <= count; i++) {
    const nodeName = 'Node-' + i; //nodename formated as 'Node-n' where n is node numebr
    const url1 = `https://blockchainnodeengine.googleapis.com/v1/projects/${projectId}/locations/${location}/blockchainNodes?blockchain_node_id=${nodeName}`; //google cloud api request
    const request_data = {
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
    axios.post(url, request_data, {
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
  }
};

module.exports = makeNodes;