import axios from 'axios'; // Allows the use of HTTP requests for API usage
import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process
import fs from 'fs/promises';

const accessToken = execSync('gcloud auth print-access-token').toString().trim(); // Receive acess toten through a subprocess
const projectId = 'blockchainticketing';
const location = 'us-central1';

class Endpoint {
    constructor(jsonRpc, socket) {
      this.jsonRpc = jsonRpc;
      this.socket = socket;
    }
}

async function getNodeInfo(){
    console.log('Fetching blockchain node information from Google Cloud....')

    // Get node count and formulate URLs from networkInfo.json
    let count = 0;
    let urls = [];
    const data = await fs.readFile('backend/blockchain/networkInfo.json', 'utf8');
    let fileData = JSON.parse(data);
    count = fileData.nodeCount;
    for(let i = 1; i <=count; i++){
        const nodeName = `Node-${i}`;
        urls.push(`https://blockchainnodeengine.googleapis.com/v1/projects/${projectId}/locations/${location}/blockchainNodes/${nodeName}`);
    }
    // Get the endpoints for the nodes through an API request

    let endpoints = []
    await Promise.all(
        urls.map(async (url) => {
            try {
                const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                });
                const jsonRpc = response.data.connectionInfo.endpointInfo.jsonRpcApiEndpoint;
                const socket = response.data.connectionInfo.endpointInfo.websocketsApiEndpoint;
                endpoints.push(new Endpoint(jsonRpc, socket));
            } catch (error) {
                console.error('Error fetching node info:', error.response?.data || error.message);
                return null;
            }
        })
    );

    for(let i = 0; i <count; i++){
        fileData.nodeEndpoints[`Node-${i+1}`] = fileData.nodeEndpoints[`Node-${i+1}`] || {}; // Initialize if not already set
        fileData.nodeEndpoints[`Node-${i+1}`].jsonRpcApiEndpoint = endpoints[i].jsonRpc
        fileData.nodeEndpoints[`Node-${i+1}`].websocketsApiEndpoint = endpoints[i].socket
    }

    await fs.writeFile('backend/blockchain/networkInfo.json', JSON.stringify(fileData, null, 2), (err) => {
        if (err) {
          console.error('Error writing to networkInfo.json file:', err);
        }
      });

    console.log('Information Received and Logged.')
};

export default getNodeInfo;