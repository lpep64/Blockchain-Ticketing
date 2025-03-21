// DATABASE WORK NEEDED
import events from "../../defaultEvents.js"

// seat info is stored as a 16 digit hex number relating to each character in the seatinfo string, this function converts from the way it is stored on the blockchain to a normal string
function fromBytes16(buf) {
    const unBuff = buf.substring(2);
    const charArray = unBuff.match(/.{1,2}/g) || [];
    const str = String.fromCharCode(...charArray.map(hex => parseInt(hex, 16))).replace(/\x00/g, "");
    return str;

}

function blockTicketToRealTicket(eventID, seatInfo, ticketID){
    try{
        const foundEvent = events.find(event => event.ID === Number(eventID));
        const stringSeatInfo = fromBytes16(seatInfo);
        const QRCode = String(ticketID) //replace with actual QR code generator seeded from ticketID
        console.log(eventID)
        return{
            sport: foundEvent.sport,
            title: foundEvent.title,
            location: foundEvent.location,
            date: foundEvent.date,
            seat: stringSeatInfo,
            QRCode: QRCode
        }
    }catch (error){
        return error;
    }
}


export default blockTicketToRealTicket;