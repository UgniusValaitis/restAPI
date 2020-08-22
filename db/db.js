const mongoose = require('mongoose')
const mongodb = "mongodb://mongo:27017/currencyConverter"
function connect() {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongodb,
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => { console.log('DB Connected') })
            .then((res, err) => {
                if (err) return reject(err);
                resolve();
            })
    });
};

function disconnect() {
    return mongoose.disconnect();
}
module.exports = { connect, disconnect };