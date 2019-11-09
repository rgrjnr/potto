let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let checkinSchema = mongoose.Schema({
    device: { type: ObjectId, required: true},
    user: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
});

let Checkin = module.exports = mongoose.model('Checkin', checkinSchema);