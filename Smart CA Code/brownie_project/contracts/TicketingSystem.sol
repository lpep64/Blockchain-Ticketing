
// This contract generates a unique ticket for each user and stores it on the blockchain.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketingSystem {
    uint256 public ticketCount;
    mapping(address => uint256) public tickets;

    event TicketGenerated(address indexed user, uint256 ticketId);

    function generateTicket() public {
        ticketCount += 1;
        tickets[msg.sender] = ticketCount;
        emit TicketGenerated(msg.sender, ticketCount);
    }

    function getTicket(address user) public view returns (uint256) {
        return tickets[user];
    }
}
