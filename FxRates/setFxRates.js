const axios = require('axios');
const xml2js = require('xml2js').parseString;
const FxRates = require("../db/models/FxRates");
const FxNames = require("../db/models/FxNames");
const { model } = require('../db/models/FxRates');
const updateInterval = 7200000;

async function getRates() {

    try {
        const ratesXml = await axios.get("https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=lt")
        try {
            await FxRates.deleteMany({})
            let EURrate = new FxRates({
                ccy: "EUR",
                rate: 1,
            })
            try {
                await EURrate.save()
                const xmlresult = xml2js(ratesXml.data, function (err, result) {
                    if (err) {
                        console.log("Parse Exchange ERROR: " + err);
                    };
                    let names = [];
                    result.FxRates.FxRate.forEach(rates => {
                        const ccy = String(rates.CcyAmt[1].Ccy);
                        names.push(ccy);
                        const rate = parseFloat(rates.CcyAmt[1].Amt);
                        const addRate = new FxRates({
                            ccy: ccy,
                            rate: rate
                        });
                        addRate.save()
                            .then()
                            .catch(err => {
                                console.log("Upload ERROR: " + err)
                            });
                    });
                    console.log("Refreshed FxRates")
                });
            } catch (err) {
                console.log("Upload ERROR: " + err)
            };
        } catch (err) {
            console.log("Delete ERROR" + err)
        };
    } catch (err) {
        console.log("Get rates xml ERROR:" + err)
    };
}

async function getNames() {
    try {
        await FxNames.deleteMany({})
    } catch (err) {
        console.log("Delete Names ERROR:" + err)
    };
    try {
        const data = await FxRates.find();
        const names = [];
        data.forEach((res) => {
            names.push(res.ccy)
        })
        try {
            const namesXml = await axios.get("https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrencyList?")
            xml2js(namesXml.data, (err, result) => {
                if (err) {
                    console.log("Parse Names ERROR: " + err)
                };
                result.CcyTbl.CcyNtry.forEach((res) => {
                    let ccy = String(res.Ccy);
                    if (names.includes(ccy) == true || ccy == "EUR") {
                        const nameLt = res.CcyNm[0]['_'];
                        const nameEn = res.CcyNm[1]['_'];
                        const addNames = new FxNames({
                            ccy: ccy,
                            nameLt: nameLt,
                            nameEn: nameEn
                        });
                        addNames.save()
                            .then()
                            .catch(err => console.log('Uploading Names ERROR:' + err));
                    };
                });
            });
            console.log("Refreshed FxNames")
        } catch (err) {
            console.log("Get Names ERROR: " + error);
        };
    } catch (err) {
        console.log("Get Rates from DB ERROR: " + err);
    };

};

function UpdateFxRates() {
    setTimeout(() => {
        getRates()
            .then(() => {
                getNames();
                UpdateFxRates();
            })
    }, updateInterval);
}
UpdateFxRates();
module.exports = {
    getRates,
    getNames
}