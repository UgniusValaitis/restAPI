const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const FxRates = require("./models/FxRates")
const FxNames = require("./models/FxNames");
const User = require("./models/User");
const Activity = require("./models/Activity")
const { find } = require('./models/FxRates');
const setFxRates = require("./FxRates/setFxRates");
const count = require('./functions/count')

const port = process.env.PORT || 3001
const mongodb = process.env.MONGODB || " mongodb://mongo:27017/currencyConverter" //"mongodb://uvalait1:Slaptas326!@ds117070.mlab.com:17070/heroku_dmlslhq8";

const app = express();
app.use(bodyParser.json());
mongoose.connect(
    mongodb,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('DB Connected') })
setFxRates.getRates()


app.get('/', async (req, res) => {
    try {
        const data = await FxNames.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    };
});

app.get('/rates', async (req, res) => {

    try {
        const data = await FxRates.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    };
});

app.get("/:fromCcy/:toCcy", async (req, res) => {
    try {
        const from = await FxRates.find({ ccy: req.params.fromCcy }, "rate ccy");
        try {
            const to = await FxRates.find({ ccy: req.params.toCcy }, "rate ccy");
            try {
                const data = await count.exRate(from, to);

                res.status(200).json(data);
            } catch (err) { res.json("Calculation ERROR: " + err) };
        } catch (err) { res.status(400).json(err) };
    } catch (err) {
        res.status(400).json(err);
    };
});

app.get("/:fromCcy/:toCcy/:amount", async (req, res) => {
    const amount = req.params.amount
    try {
        const from = await FxRates.find({ ccy: req.params.fromCcy }, "rate ccy");
        try {
            const to = await FxRates.find({ ccy: req.params.toCcy }, "rate ccy");
            try {
                const data = await count.exAmount(from, to, amount);
                res.status(200).json(data)
            } catch (err) {
                res.status(400).json("Calculation ERROR: " + err);
            };
        } catch (err) {
            res.status(400).json(err);
        };

    } catch (err) {
        res.status(400).json(err);
    };
});

app.post("/user", (req, res) => {
    const user = new User({
        session: req.body.session
    })
    user.save()
        .then((mes) => res.status(200).json(mes))
        .catch(err => res.status(400).json(err));
});

app.post("/activity", (req, res) => {
    const activity = new Activity({
        session: req.body.session,
        fromCcy: req.body.fromCcy,
        toCcy: req.body.toCcy,
        amount: req.body.amount
    });
    activity.save()
        .then((mes) => res.status(200).json(mes))
        .catch((err) => res.status(400).json(err));
});

app.listen(port)