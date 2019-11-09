let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let inviteSchema = mongoose.Schema({
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
    
    event: { type: ObjectId, required: true},
    invited_user: { type: String, required: true },
    accepted: { type: Boolean, default: false },
});

let Invite = module.exports = mongoose.model('Invite', inviteSchema);