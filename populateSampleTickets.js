import { response } from 'express';
import callWithFailover from './backend/blockchain/nodeInterface.js'
import Web3 from 'web3'
import blockTicketToRealTicket from './backend/blockchain/convertBCTicket.js'

function toBytes16(str) {
    const buf = Buffer.alloc(16); // Create a 16-byte buffer filled with 0x00
    const strBytes = Buffer.from(str, 'utf8'); // Convert string to bytes
    strBytes.copy(buf, 16 - strBytes.length); // Copy bytes to the end
    return buf;
}

const eventIDs = [1, 3, 4];
const seatInfos = ["GenAd", "Sec104:A14", "GenAd"];
const encodedSeatInfos = seatInfos.map(info => toBytes16(info));

console.log(eventIDs);
console.log(encodedSeatInfos);

const netID = 'smf21001'
const hashedNetID = Web3.utils.keccak256(netID);

for(let i = 0; i < eventIDs.length; i++){
    await callWithFailover('generateTicket', hashedNetID, eventIDs[i], encodedSeatInfos[i])
}