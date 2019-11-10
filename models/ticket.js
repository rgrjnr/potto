let mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

let ticketSchema = mongoose.Schema({
    author: { type: ObjectId, required: true},
    product: { type: ObjectId, required: true},
    created_on: { type: Date, default: Date.now },
    currency: { type: String, default: 'BRL'},
    price: { type: Number, default: 0 },
    info: {
        name: { type: String },
        description: { type: String },
        date: { type: Date },
        event: {
            title: { type: String, required: true },
            id: { type: ObjectId, required: true},
        }
    },
    client: {
        fullname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        document: {
            type: { type: String, required: true, enum: ['cpf', 'cnpj'] },
            number: { type: String, required: true }
        }
    },
    address:{  
        city: { type: String },
        district: { type: String },
        street: { type: String },
        streetNumber: { type: String },
        zipCode: { type: String },
        state: { type: String },
        country:  { type: String, default: 'BRA' },
     },
    questions: [{
        question: { type: ObjectId, required: true},
        answer: { type: String, required: true },
    }],
    status: { type: String, required: true, default: 'AUTHORIZED', enum: ['CREATED', 'WAITING', 'IN_ANALYSIS', 'PRE_AUTHORIZED', 'AUTHORIZED', 'CANCELLED', 'REFUNDED', 'REVERSED' ] },
    active: { type: Boolean, default: false }

});

let Ticket = module.exports = mongoose.model('Ticket', ticketSchema);

