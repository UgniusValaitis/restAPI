Back end restAPI project for Currency Converter 

Docker containerized || buld in unit test with Mocha and Chai

to try out and start server run docker-compose up

Server is deployed at http://ugniusvalaitis.xyz


to run tests first 

in ./db/db.js 

CHNAGE const mongodb = "mongodb://mongo:27017/currencyConverter"


TO const mongodb = "mongodb://localhost:27017/currencyConverter"


THEN run: npm test
