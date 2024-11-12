
// This contract generates a unique ticket for each user and stores it on the blockchain.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketingSystem {
    uint256 public ticketCount;
    mapping(bytes32 => uint256) public tickets;

    event TicketGenerated(bytes32 indexed hashedNetID, uint256 ticketId);

    function generateTicket(bytes32 hashedNetID) public {
        ticketCount += 1;
        tickets[hashedNetID] = ticketCount;
        emit TicketGenerated(hashedNetID, ticketCount);
    }

    function getTicket(bytes32 hashedNetID) public view returns (uint256) {
        return tickets[hashedNetID];
    }
}
