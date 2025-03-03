import callWithFailover from "./nodeInterface.js";
import Web3 from 'web3'

// Script used to obtain ticket information while that feature isn't available on frontend


// Update netID
const netID = 'smf21001'

const hashedSenderNetID = Web3.utils.keccak256(netID);


const response = await callWithFailover('getTicketsByNetID', hashedSenderNetID);
console.log('owner should be ', hashedSenderNetID);
console.log(response)
