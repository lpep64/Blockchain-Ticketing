const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Route to claim a ticket
router.post('/claim', ticketController.claimTicket);

module.exports = router;