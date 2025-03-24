

// This contract generates a unique ticket for each user and stores it on the blockchain.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketingSystem {
    uint256 public ticketCount; //count of tickets - used to create ticket ids

    struct Ticket{ //structure for ticket - contains all data we want stored on contract
        uint256 id;
        uint256 eventId;
        bytes32 owner;  //hashed netID
        bytes16 seatInfo;
    }

    mapping(bytes32 => Ticket[]) public tickets; //maps a hashed netID to their owned tickets
    mapping(uint256 => Ticket) public ticketIDs;
    // we need to make sure that users are able to hold multiple tickets

    event newOwner(uint256 id, bytes32 owner, uint256 eventID, bytes16 seatInfo);

    function generateTicket(bytes32 netID, uint256 givenEventID, bytes16 givenSeatInfo) public{
        ticketCount += 1;
        Ticket memory newTicket = Ticket({id: ticketCount, eventId: givenEventID, owner: netID, seatInfo: givenSeatInfo});
        ticketIDs[ticketCount] = newTicket;
        tickets[netID].push(newTicket);
        emit newOwner(newTicket.id, netID, givenEventID, givenSeatInfo);
    }

    function unclaimTicket(bytes32 netID, uint256 givenEventID) public {
        int index = ticketIndexFinder(givenEventID, netID);
        require(index != -1, "User does not have a ticket to this event");
        uint256 id = tickets[netID][uint256(index)].id;
        delete ticketIDs[id];
        tickets[netID][uint256(index)] = tickets[netID][tickets[netID].length - 1];
        tickets[netID].pop();
    }


    function getTicketsByNetID(bytes32 netID) public view returns(Ticket[] memory){
        Ticket[] memory userTickets = tickets[netID];
        return userTickets;
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

        ticketIDs[tempTicket.id].owner = netIDRecipient;

        emit newOwner(tempTicket.id, tempTicket.owner, tempTicket.eventId, tempTicket.seatInfo);
    }

    function ticketIndexFinder(uint256 eventId, bytes32 user) internal view returns (int){ //checks if a given user has a ticket for an event
        for (uint i = 0; i < tickets[user].length; i++){
            if(tickets[user][i].eventId == eventId){
                return int(i); //returns the index of that ticket in tickets[user]
            }
        }
        return -1; //returns -1 if ticket is not found
    }

    function getTicketByID(uint256 id) public view returns(bytes32){
        return ticketIDs[id].owner;
    }
}