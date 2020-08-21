const axios = require('axios');
const xml2js = require('xml2js').parseString;
const FxRates = require("../models/FxRates");
const FxNames = require("../models/FxNames");
const { model } = require('../models/FxRates');
const updateInterval = 7200000;

function getRates() {
    axios.get("https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=lt")
        .then(response => {
            FxRates.deleteMany({})
                .then()
                .catch(err => {
                    console.log("delete ERROR:" + err);
                });
            xml2js(response.data, function (err, result) {
                if (err) {
                    console.log("Parse Exchange ERROR: " + err);
                };
                const EURrate = new FxRates({
                    ccy: "EUR",
                    rate: 1,
                })
                EURrate.save()
                    .then()
                    .catch(err => console.log("Upload ERROR: " + err));
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
                getNames(names);
            });
            setTimeout(() => {
                getRates()
            }, updateInterval);
        }).catch((err) => {
            console.log("Get Exchange ERROR: " + err);
        });
}
function getNames(names) {
    FxNames.deleteMany({})
        .then()
        .catch(err => console.log("Delete Names ERROR:" + err))
    axios.get("https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrencyList?")
        .then((response) => {
            xml2js(response.data, (err, result) => {
                if (err) {
                    console.log("Parse Names ERROR: " + err)
                };
                result.CcyTbl.CcyNtry.forEach((res) => {
                    let ccy = String(res.Ccy);
                    if (names.includes(ccy) == true || ccy == "EUR") {
                        const nameLt = res.CcyNm[0]['_'];
                        const nameEn = res.CcyNm[0]['_'];
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
        }).catch((error) => {
            console.log("Get Names ERROR: " + error);
        });
};


module.exports = {
    getRates,
}