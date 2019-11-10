let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let deviceSchema = mongoose.Schema({
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
    company: { type: ObjectId },
    event: { type: ObjectId },
    active: { type: Boolean, default: false },
    permissions: [{
        user: {type: ObjectId, required: true},
        role: { type: String, required: true, default: 'watcher' },
    }]
});

let Device = module.exports = mongoose.model('Device', deviceSchema);