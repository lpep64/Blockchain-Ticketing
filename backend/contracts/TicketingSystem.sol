
// This contract generates a unique ticket for each user and stores it on the blockchain.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketingSystem {
    uint256 public ticketCount; //count of tickets - used to create ticket ids

    struct Ticket{ //structure for ticket - contains all data we want stored on contract
        uint256 id;
        uint256 eventId;
        string seatInfo;
        bytes32 owner;  //hashed netID
    }

    mapping(bytes32 => Ticket[]) public tickets; //maps a hashed netID to their owned tickets
    // we need to make sure that users are able to hold multiple tickets

    // event TicketGenerated(uint256 id, uint256 eventId, string seatInfo, bytes32 owner); // event for something to listen to, will trigger an event when a ticket is generated
    // event TicketTransfered(bytes32 sender, bytes32 newOwner, uint256 id, uint256 eventId, string seatInfo); // event for a ticket transfer

    function generateTicket(bytes32 netID, uint256 givenEventID, string memory givenSeatInfo) public {
        ticketCount += 1;
        Ticket memory newTicket = Ticket({id: ticketCount, eventId: givenEventID, seatInfo: givenSeatInfo, owner: netID});
        tickets[netID].push(newTicket);
        // emit TicketGenerated(newTicket.id, newTicket.eventId, newTicket.seatInfo, netID);
    }

    function getTicketsByNetID(bytes32 netID) public view returns (Ticket[] memory){
        return tickets[netID];
    }

// logic for transfering ticket
    function transferTicket(bytes32 netIDSender, bytes32 netIDRecipient, uint256 eventId) public{
        require(netIDSender != netIDRecipient, "Cant transfer a ticket to yourself");
        int indexInt = ticketIndexFinder(eventId, netIDSender); //find the index of the ticket wanting to be transfered from the senders ticket array
        require(indexInt != -1, "User trying to send a ticket does not own a ticket for this event"); //verify that the sender actually has a ticket to transfer
        uint256 index = uint256(indexInt);
        Ticket memory tempTicket = tickets[netIDSender][index];
        tickets[netIDSender][index] = tickets[netIDSender][tickets[netIDSender].length-1];
        tickets[netIDSender].pop();
        tempTicket.owner = netIDRecipient;
        tickets[netIDRecipient].push(tempTicket);
        // emit TicketTransfered(netIDSender, netIDRecipient, tempTicket.id, tempTicket.eventId, tempTicket.seatInfo);
    }

    function ticketIndexFinder(uint256 eventId, bytes32 user) internal view returns (int){ //checks if a given user has a ticket for an event
        for (uint i = 0; i < tickets[user].length; i++){
            if(tickets[user][i].eventId == eventId){
                return int(i); //returns the index of that ticket in tickets[user]
            }
        }
        return -1; //returns -1 if ticket is not found
    }
}