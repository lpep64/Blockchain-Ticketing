import Web3 from 'web3';
import fs from 'fs/promises';
import { execSync } from 'child_process';


// CONNECT TO NODE AND CREATING CONTRACT INSTANCES
// This code can support multiple VMs running concurrent networks
const networkIP = execSync('gcloud compute instances list --filter="name=eth-network" --format="get(networkInterfaces[0].accessConfigs[0].natIP)"')
const accountKey = execSync('gcloud secrets versions access latest --secret="eth-priv-key"').toString().trim(); // ethereum account key stays hidden

let web3Nodes = [];

web3Nodes.push(new Web3(`http://${networkIP}:8545`)) //Connect to the network

const accounts = await web3Nodes[0].eth.getAccounts()
const account = accounts[0]

// Get the contract info
const contractAddress = await fs.readFile('backend/blockchain/contractAddress.txt', 'utf8');
console.log("Ethereum Ticket Smart Contract Address:", contractAddress);

const ABIdata = await fs.readFile('backend/blockchain/contractABI.json', 'utf8');
const contractABI = JSON.parse(ABIdata);

// Create contract instances for each VM
const ticketContracts = web3Nodes.map(web3 => new web3.eth.Contract(contractABI, contractAddress));

// Calls a falls a method (given by methodName) on the smart contracts in the Eth network
// EXAMPLE USAGE: callWithFailover('generateTicket', hashedNetID, eventID, seatInfo);
// If the method called returs something it can be accessed in the result returned from this function
// This function will log the transaction details
async function callWithFailover(methodName, ...args) {
    const senderAccount = account;
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