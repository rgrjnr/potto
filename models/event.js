let mongoose = require('mongoose');

let eventSchema = mongoose.Schema({
    title: { type: String, required: true }
});

let Event = module.exports = mongoose.model('Event', eventSchema);