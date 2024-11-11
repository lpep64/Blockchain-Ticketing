import Web3 from 'web3';

// Replace these URLs with the actual endpoints of our nodes
const node1 = new Web3('NODE_1_ENDPOINT_URL');
const node2 = new Web3('NODE_2_ENDPOINT_URL');
const node3 = new Web3('NODE_3_ENDPOINT_URL');

const web3Nodes = [node1, node2, node3];

// Replace 'CONTRACT_ADDRESS' with the deployed contract's address
const contractAddress = 'CONTRACT_ADDRESS';
const contractABI = [/*Contract ABI */];

// Create contract instances for each node
const ticketContracts = web3Nodes.map(web3 => new web3.eth.Contract(contractABI, contractAddress));

// Calls a falls a method (given by methodName) on the smart contracts stored in the nodes
// Methods are defined in the smart constract
// If one node fails to be connected to for whatever reason it moves on to the next one
async function callWithFailover(methodName, ...args) {
    for (let i = 0; i < ticketContracts.length; i++) {
        try {
            const result = await ticketContracts[i].methods[methodName](...args).call();
            console.log(`Success with node ${i + 1}:`, result);
            return result;
        } catch (error) {
            console.error(`Error with node ${i + 1}:`, error);
        }
    }
    throw new Error("All nodes failed to respond.");
}

// Send a transaction (given by methodName) on the smart contracts stored in the nodes
// Again, transaction methods are given in the smart contract
// If one node fails to be connected to for whatever reason it moves onto the next noe
async function sendTransactionWithFailover(methodName, ...args) {
    const privateKey = 'PRIVATE_KEY'; //our authentication key for the nodes, this needs to be hidden somewhere
    const account = web3Nodes[0].eth.accounts.privateKeyToAccount(privateKey); // Use the first node to create an account
    web3Nodes.forEach(web3 => web3.eth.accounts.wallet.add(account));

    for (let i = 0; i < ticketContracts.length; i++) {
        try {
            const receipt = await ticketContracts[i].methods[methodName](...args).send({
                from: account.address,
                gas: 3000000 // ADJUST GAS LIMIT DONT KNOW OPTIMAL VALUE FOR OUR SCENERIO
            });
            console.log(`Transaction successful with node ${i + 1}:`, receipt);
            return receipt; // Return the successful transaction receipt
        } catch (error) {
            console.error(`Transaction error with node ${i + 1}:`, error);
        }
    }
    throw new Error("Transaction failed on all nodes.");
}