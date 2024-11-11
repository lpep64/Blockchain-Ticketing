const Web3 = require('web3');
const TicketingSystemABI = require('../artifacts/TicketingSystemABI.json'); // ABI for the contract
const { contractAddress } = require('../config'); // Contract deployed address
const Student = require('../models/studentModel');
const Event = require('../models/eventModel');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Replace with your node URL

// Contract instance
const ticketingContract = new web3.eth.Contract(TicketingSystemABI, contractAddress);

// Endpoint to claim a ticket
exports.claimTicket = async (req, res) => {
  const { netID, eventID } = req.body;

  try {
    // Find the student and event in the database
    const student = await Student.findOne({ netID });
    const event = await Event.findOne({ eventID });

    if (!student || !event) {
      return res.status(404).json({ error: 'Student or Event not found' });
    }

    // Check if tickets are available
    if (event.availableTickets <= 0) {
      return res.status(400).json({ error: 'No tickets available for this event' });
    }

    // Generate the ticket using the smart contract
    const accounts = await web3.eth.getAccounts();
    const receipt = await ticketingContract.methods.generateTicket().send({
      from: accounts[0], // Account to use for transaction
      gas: 3000000, // Gas limit
    });

    // Store ticket data (ticketId) in the student's record
    student.ticketID = receipt.events.TicketGenerated.returnValues.ticketId;
    await student.save();

    // Update available tickets for the event
    event.availableTickets -= 1;
    await event.save();

    res.json({ message: 'Ticket claimed successfully', ticketID: student.ticketID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};