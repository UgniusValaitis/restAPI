const mongoose = require('mongoose');

const RatesSchema = mongoose.Schema({
    ccy: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FxRates', RatesSchema);