let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let companySchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, required: true },
    event: { type: ObjectId, required: true },
    invite: { type: ObjectId, required: true },
    description: { type: String },
    logo_url: { type: String },
    contact_info: {
        website: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
    },
    permissions: [{
        user: { type: ObjectId, required: true },
        role: { type: String, required: true, default: 'watcher' },
    }],

    created_on: { type: Date, default: Date.now },
});

let Company = module.exports = mongoose.model('Company', companySchema);