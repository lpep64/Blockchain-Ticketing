const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventID: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  dateTime: { type: Date, required: true },
  venue: { type: String, required: true },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true }
});

module.exports = mongoose.model('Event', eventSchema);