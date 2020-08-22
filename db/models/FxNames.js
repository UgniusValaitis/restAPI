const mongoose = require('mongoose');
const { model } = require('./FxRates');

const NamesSchema = mongoose.Schema({
    ccy: {
        type: String,
        required: true,
    },
    nameLt: {
        type: String,
        required: true,
    },
    nameEn: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('FxNames', NamesSchema);