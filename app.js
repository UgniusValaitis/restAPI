const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const FxRates = require("./db/models/FxRates")
const FxNames = require("./db/models/FxNames");
const User = require("./db/models/User");
const Activity = require("./db/models/Activity")
const { find, model } = require('./db/models/FxRates');
const conn = require("./db/db");
const setFxRates = require("./FxRates/setFxRates");
const count = require('./functions/count')

const port = 3001
const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    const origin = req.get('origin');

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

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
        const from = await FxRates.find({ ccy: req.params.fromCcy });
        try {
            const to = await FxRates.find({ ccy: req.params.toCcy }, "rate ccy");
            try {
                const data = await count.exRate(from, to);

                res.status(200).json(data);
            } catch (err) { res.status(400).json("Calculation ERROR: " + err) };
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
conn.connect()
    .then(() => {
        setFxRates.getRates()
            .then(() => {
                setFxRates.getNames()
                    .then(() => {
                        app.listen(port, () => {
                            console.log("Server is listening: ");
                            app.emit('serverStarted');
                        });
                    })
            });
    })
    .catch((err) => console.log("Db connect ERROR: " + err));

module.exports = app