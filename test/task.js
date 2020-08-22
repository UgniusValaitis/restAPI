const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require('../app');
const { expect } = require("chai");

// BEFORE RUNNING TEST CHANGE DB TO localhost from mongo in ../db/db.js

chai.expect();
chai.use(chaiHttp);

before(function (done) {
    this.timeout(10000)
    server.on('serverStarted', done)
})

describe("Test API", function () {
    before(function () {

    })
    describe("GET /", () => {
        it("status 200", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                })
        })
        it("response JSON", (done) => {
            chai.request("http://localhost:3001")
                .get('/')
                .end((err, res) => {
                    expect(res.type == "application/json").to.be.true;
                    done();
                })
        })
        it("contains names ccy", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res.body[1]).to.have.property('ccy');
                    done();
                })
        })
        it("contains nameLt", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res.body[1]).to.have.property('nameLt');
                    done();
                })
        })
        it("contains nameEn", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res.body[1]).to.have.property('nameEn');
                    done();
                })
        })
        it("return multiple names", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res.body.length > 3).to.be.true;
                    done();
                })
        })

    })

    describe("GET /rates", () => {
        it("status 200", (done) => {
            chai.request(server)
                .get('/rates')
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                })
        })
        it("response JSON", (done) => {
            chai.request(server)
                .get('/rates')
                .end((err, res) => {
                    expect(res.type == "application/json").to.be.true;
                    done();
                })
        })
        it("contains ccy", (done) => {
            chai.request(server)
                .get('/rates')
                .end((err, res) => {
                    expect(res.body[0]).to.have.property("ccy");
                    done();
                })
        })
        it("contains rate", (done) => {
            chai.request(server)
                .get('/rates')
                .end((err, res) => {
                    expect(res.body[0]).to.have.property("rate");
                    done();
                })
        })
        it("return multiple rates", (done) => {
            chai.request(server)
                .get('/rates')
                .end((err, res) => {
                    expect(res.body.length > 3).to.be.true;
                    done();
                })
        })
    })
    describe("GET /:fromCcy/:toCcy", () => {
        it("status 200", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                })
        })
        it("response JSON", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.type == 'application/json').to.be.true;
                    done();
                })
        })
        it("contains fromCcy", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.body).to.have.property("from");
                    done();
                })
        })
        it("contains toCcy", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.body).to.have.property("to");
                    done();
                })
        })
        it("contains rate", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.body).to.have.property("rate");
                    done();
                })
        })
        it("Rate Counter", (done) => {
            chai.request(server)
                .get('/EUR/EUR')
                .end((err, res) => {
                    expect(res.body.rate == 1).to.be.true;
                    done();
                })
        })
    })
    describe("GET /:fromCcu/:toCcy/:amount", () => {
        it("status 200", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                })
        })
        it("response JSON", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.type == 'application/json').to.be.true;
                    done();
                })
        })
        it("contains from", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body).to.contain.property('from');
                    done();
                })
        })
        it("from contains correct Ccy", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body.from[0] == "EUR").to.be.true;
                    done();
                })
        })
        it("from contains correct amount", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body.from[1] == 1).to.be.true;
                    done();
                })
        })
        it("contains to", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body).to.contain.property('to');
                    done();
                })
        })
        it("to contains correct Ccy", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body.to[0] == "EUR").to.be.true;
                    done();
                })
        })
        it("to contains correct amount", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body.to[1] == 1).to.be.true;
                    done();
                })
        })
        it("contains rate", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body).to.contain.property('rate');
                    done();
                })
        })
        it("correct rate", (done) => {
            chai.request(server)
                .get('/EUR/EUR/1')
                .end((err, res) => {
                    expect(res.body.rate == 1).to.be.true;
                    done();
                })
        })
    })
    describe("POST /user", () => {
        it("status 200", (done) => {
            chai.request(server)
                .post("/user")
                .set("content-type", "application/json")
                .send({ session: "1234" })
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                });
        });
        it("contains session", (done) => {
            chai.request(server)
                .post("/user")
                .set("content-type", "application/json")
                .send({ session: "1234" })
                .end((err, res) => {
                    expect(res.body).to.contain.property('session');
                    done();
                });
        })
        it("passes correct session", (done) => {
            chai.request(server)
                .post("/user")
                .set("content-type", "application/json")
                .send({ session: "1234" })
                .end((err, res) => {
                    expect(res.body.session == "1234").to.be.true;
                    done();
                });
        })
    });
    describe("POST /activity", () => {
        it("status 200", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.status == 200).to.be.true;
                    done();
                });
        });
        it("response JSON", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.type == "application/json").to.be.true;
                    done();
                });
        });
        it("contains session", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body).to.contain.property("session");
                    done();
                });
        });
        it("passes correct session", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body.session == "1234").to.be.true;
                    done();
                });
        });
        it("contains fromCcy", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body).to.contain.property('fromCcy');
                    done();
                });
        });
        it("passes correct fromCcy", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body.fromCcy == "EUR").to.be.true;
                    done();
                });
        });
        it("contains toCcy", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body).to.contain.property('toCcy');
                    done();
                });
        });
        it("passes correct toCcy", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body.toCcy == "EUR").to.be.true;
                    done();
                });
        });
        it("contains amount", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body).to.contain.property('amount');
                    done();
                });
        });
        it("passes correct amount", (done) => {
            chai.request(server)
                .post("/activity")
                .set("content-type", "application/json")
                .send({
                    session: "1234",
                    fromCcy: "EUR",
                    toCcy: "EUR",
                    amount: "1"
                })
                .end((err, res) => {
                    expect(res.body.amount == "1").to.be.true;
                    done();
                });
        });
    });
});