import callWithFailover from './backend/blockchain/nodeInterface.js'

function toBytes16(str) {
    const buf = Buffer.alloc(16); // Create a 16-byte buffer filled with 0x00
    const strBytes = Buffer.from(str, 'utf8'); // Convert string to bytes
    strBytes.copy(buf, 16 - strBytes.length); // Copy bytes to the end
    return buf;
}

function fromBytes16(buf) {
    const unBuff = buf.substring(2);
    const charArray = unBuff.match(/.{1,2}/g) || [];
    const str = String.fromCharCode(...charArray.map(hex => parseInt(hex, 16)));
    return str;

}

const eventIDs = [1, 3, 4];
const seatInfos = ["GenAd", "Sec104:A14", "GenAd"];
const endcodedSeatInfos = seatInfos.map(info => toBytes16(info));

console.log(eventIDs);
console.log(encodedSeatInfos);