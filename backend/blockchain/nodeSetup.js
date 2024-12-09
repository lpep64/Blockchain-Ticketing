import axios from 'axios'; // Allows the use of HTTP requests for API usage
import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Node setup
const accessToken = execSync('gcloud auth print-access-token').toString().trim(); // Receive acess toten through a subprocess
const projectId = 'blockchainticketing';
const location = 'us-central1';

async function makeNodes(){
  // Get the count of nodes to be created
  const count = await new Promise((resolve) => {
    rl.question('How many nodes would you like to create? \n -for development or low traffic environments 1 is sufficient. \n -for high traffic deployment environments consider more than 1. \n Node-Count:', (answer) => {
      resolve(parseInt(answer, 10));
      rl.close();
    });
  });
  // Update the networkInfo file with the node-count
  fs.readFile('backend/blockchain/networkInfo.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading networkInfo.json file:', err);
      return;
    }
    const fileData = JSON.parse(data);
    fileData.nodeCount = count;
    fs.writeFile('backend/blockchain/networkInfo.json', JSON.stringify(fileData, null, 2), (err) => {
      if (err) {
        console.error('Error writing to networkInfo.json file:', err);
      }
    });
  });
  // Create the nodes through an API request
  for (let i = 1; i <= count; i++) {
    const nodeName = 'Node-' + i; //nodename formated as 'Node-n' where n is node numebr
    const url = `https://blockchainnodeengine.googleapis.com/v1/projects/${projectId}/locations/${location}/blockchainNodes?blockchain_node_id=${nodeName}`; //google cloud api request
    const request_data = {
      blockchainType: "ETHEREUM",
      privateServiceConnectEnabled: false,
      ethereumDetails: {
        consensusClient: "LIGHTHOUSE",
        executionClient: "GETH",
        apiEnableAdmin: false,
        apiEnableDebug: false,
        network: "TESTNET_SEPOLIA", //allows for our own custom network
        nodeType: "full"
      },
      labels: {
        environment: "development"
      },
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

export default makeNodes;