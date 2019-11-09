let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let deviceSchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
});

let Device = module.exports = mongoose.model('Device', deviceSchema);