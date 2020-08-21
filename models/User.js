const mongoose = require('mongoose');
const { model } = require('./FxRates');

const UserSchema = mongoose.Schema({
    session: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema);