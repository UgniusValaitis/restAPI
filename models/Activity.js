const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
    session: {
        type: String,
        required: true
    },
    fromCcy: {
        type: String,
        required: true,
    },
    toCcy: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Activity", ActivitySchema)