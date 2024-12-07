import Web3 from 'web3';
import fs from 'fs/promises';
import readline from 'readline';

// Get Neccissary Info From user
// Ideally this is automated in final prouduct
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const key = await new Promise((resolve) => {
    rl.question('Plese enter your google cloud API key: ', (answer) => {
        resolve(answer);
    });
});

const account = await new Promise((resolve) => {
    rl.question('Enter your sepolia account address: ', (answer) => {
        resolve(answer);
    });
});

const accountKey = await new Promise((resolve) => {
    rl.question('Enter your sepolia account private key: ', (answer) => {
        resolve(answer);
        rl.close();
    });
});

// Get the endpoints of the nodes and number of nodes
const data = await fs.readFile('backend/blockchain/networkInfo.json', 'utf8');
const fileData = JSON.parse(data);

const endpoints = Object.values(fileData.nodeEndpoints).map(node => node.jsonRpcApiEndpoint);
console.log('Endpoints: ', endpoints);

const nodeCount = endpoints.length

// Formulate URLS and connect to them
let web3Nodes = [];
for(let i = 0; i< nodeCount; i++){
    const connection = new Web3(new Web3.providers.HttpProvider(`https://${endpoints[i]}?key=${key}`));
    web3Nodes.push(connection);
}

// Get the contract info
const contractAddress = fileData.contractAddress;

const ABIdata = await fs.readFile('backend/blockchain/contractABI.json', 'utf8');
const contractABI = JSON.parse(ABIdata);

// Create contract instances for each node
const ticketContracts = web3Nodes.map(web3 => new web3.eth.Contract(contractABI, contractAddress));

// Calls a falls a method (given by methodName) on the smart contracts stored in the nodes
// If one node fails to be connected to for whatever reason it moves on to the next one
async function callWithFailover(methodName, ...args) {
    const senderAccount = '0x86d0bD6A5a79164D9396260b5dA5E48f09312d8A';
    const accountKey = 'b6150607374f41c77d8bf5a1f0fda22a2265ffa089712a208825e677f357d705';
    for (let i = 0; i < ticketContracts.length; i++) {
        try {
            const result = await ticketContracts[i].methods[methodName](...args).call();

            const tx = ticketContracts[i].methods[methodName](...args).encodeABI();
            const gas = await ticketContracts[i].methods[methodName](...args).estimateGas({ from: senderAccount });
            const gasPrice = await web3Nodes[i].eth.getGasPrice();
            const txData = {
                from: senderAccount,
                to: contractAddress,
                data: tx,
                gas: gas,
                gasPrice: gasPrice
            };
            const signedTx = await web3Nodes[i].eth.accounts.signTransaction(txData, accountKey);
            const receipt = await web3Nodes[i].eth.sendSignedTransaction(signedTx.rawTransaction);
            console.log('Transaction receipt:', receipt);
            console.log(`Success with node ${i + 1}:`);
            return result;
        } catch (error) {
            console.error(`Error with node ${i + 1}:`, error);
        }
    }
    throw new Error("All nodes failed to respond.");
}

export default callWithFailover;