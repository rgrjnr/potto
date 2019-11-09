let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let ticketSchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
});

let Ticket = module.exports = mongoose.model('Ticket', ticketSchema);