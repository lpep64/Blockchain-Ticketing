import Web3 from 'web3';
import fs from 'fs/promises';
import solc from 'solc';
import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process

// Connect the node
const key = execSync('gcloud secrets versions access latest --secret="API-key"').toString().trim();

const account = execSync('gcloud secrets versions access latest --secret="Wallet-address1"').toString().trim();
const accountKey = execSync('gcloud secrets versions access latest --secret="Wallet-key1"').toString().trim();

const data = await fs.readFile('backend/blockchain/networkInfo.json', 'utf8');
const fileData = JSON.parse(data);

const endpoint = fileData.nodeEndpoints["Node-1"].jsonRpcApiEndpoint;

const web3 = new Web3(new Web3.providers.HttpProvider(`https://${endpoint}?key=${key}`));

web3.eth.net.isListening()
  .then(() => console.log('Connected to Ethereum node'))
  .catch(e => console.error('Connection failed', e));

// Compile the contract
const source = await fs.readFile('backend/contracts/TicketingSystem.sol', 'utf8');
const input = {
    language: 'Solidity',
    sources: {
        'contract.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode.object']
            }
        }
    }
};
const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = compiled.contracts['contract.sol'].TicketingSystem.abi;
const bytecode = compiled.contracts['contract.sol'].TicketingSystem.evm.bytecode.object;

// Store the ABI
// const ABIfileData = JSON.stringify(abi);
fs.writeFile('backend/blockchain/contractABI.json', JSON.stringify(abi, null, 2), (err) => {
    if (err) {
      console.error('Error writing to contractABI.json file:', err);
    }
})

// Store the bytecode
fs.writeFile('backend/blockchain/contractBytecode.txt', bytecode, (err) => {
    if (err) {
      console.error('Error writing to contractBytecode.txt file:', err);
    }
})

// Deploy the contract
const contract = new web3.eth.Contract(abi);

async function deployContract() {
    const deployTx = contract.deploy({
      data: bytecode,
    });
  
    const gas = await deployTx.estimateGas({ from: account });
    const gasPrice = await web3.eth.getGasPrice();
  
    const tx = {
      from: account,
      to: null,
      data: deployTx.encodeABI(),
      gas,
      gasPrice,
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, accountKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Contract deployed at address:', receipt.contractAddress);
}

deployContract()