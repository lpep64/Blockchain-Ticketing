import Web3 from 'web3';
import fs from 'fs/promises';
import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process

// Get Neccissary Info From user
// Ideally this is automated in final prouduct

const networkIP = execSync('gcloud compute instances list --filter="name=eth-network" --format="get(networkInterfaces[0].accessConfigs[0].natIP)"')
const accountKey = execSync('gcloud secrets versions access latest --secret="eth-priv-key"').toString().trim();

let web3Nodes = [];

web3Nodes.push(new Web3(`http://${networkIP}:8545`))

const accounts = await web3Nodes[0].eth.getAccounts()
const account = accounts[0]

// Get the contract info
const contractAddress = fs.readFile('backend/blockchain/contractAddress.txt', 'utf8');

const ABIdata = await fs.readFile('backend/blockchain/contractABI.json', 'utf8');
const contractABI = JSON.parse(ABIdata);

// Create contract instances for each node
const ticketContracts = web3Nodes.map(web3 => new web3.eth.Contract(contractABI, contractAddress));

// Calls a falls a method (given by methodName) on the smart contracts stored in the nodes
// If one node fails to be connected to for whatever reason it moves on to the next one
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