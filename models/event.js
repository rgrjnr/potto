let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let productSchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
    description: { type: String },
    date: {type: Date},
    currency: { type: String, default: 'BRL'},
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
});

let eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: {
        type : String,
        default : mongoose.Types.ObjectId,
        index : { unique: true }
    },
    author: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
    products: [productSchema],
    info: {
        description: { type: String },
        logo: { type: String },
        banner: { type: String },
        address: { type: String },
    },
    permissions: [{
        user: { type: ObjectId, required: true },
        role: { type: String, required: true, default: 'watcher' },
    }],
    questions: [{
        title: { type: String, required: true },
        type: { type: String, required: true, enum: ['single', 'multiple', 'text']},
        options: [String],
    }]
});

let Event = module.exports = mongoose.model('Event', eventSchema);