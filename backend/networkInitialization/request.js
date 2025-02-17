import Web3 from 'web3';
// const web3 = new Web3("http://34.29.158.0:8545");

async function getAccounts() {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
}

import { execSync } from 'child_process'; // Allows for account crendentials to be received through a sub-process

// Get Neccissary Info From user
// Ideally this is automated in final prouduct

const networkIP = execSync('gcloud compute instances list --filter="name=eth-network" --format="get(networkInterfaces[0].accessConfigs[0].natIP)"').toString()
console.log(networkIP)

const web3 = new Web3(`http://${networkIP}:8545`)

const accounts = await web3.eth.getAccounts()
console.log(accounts)
const account = accounts[0]
console.log(account)
const key = 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d


// -a 1 --account="0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d ,100000000000000000000"
// nohup ganache -d -p 8545 -h 0.0.0.0  --account="0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d,10000000000000000000000000" > ganache.log 2>&1 &
// 34.29.158.0
// curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' http://34.29.158.0:8545