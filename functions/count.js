

function exRate(from, to) {
    const ccyFrom = from[0].ccy;
    const ccyTo = to[0].ccy;
    const fromRate = from[0].rate;
    const toRate = to[0].rate;
    const rate = (1 / fromRate) * toRate;
    const data = {
        from: ccyFrom,
        to: ccyTo,
        rate: rate
    }
    return data;
}


function exAmount(from, to, amount) {
    const ccyFrom = from[0].ccy;
    const ccyTo = to[0].ccy;
    const fromRate = from[0].rate;
    const toRate = to[0].rate;
    const fromAmount = amount;
    const rate = (1 / fromRate) * toRate;
    const toAmount = rate * fromAmount;
    const data = {
        from: [ccyFrom, fromAmount],
        to: [ccyTo, toAmount],
        rate: rate
    }
    return data;
}

module.exports = {
    exRate,
    exAmount
}