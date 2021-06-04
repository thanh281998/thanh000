var https = require('https');
var fs = require('fs');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require("path");
require('dotenv').load()
const port = process.env.PORT_TEST || 3000

var session = require('express-session')

var useragent = require('express-useragent');

app.use(useragent.express());

var options = {
    key: fs.readFileSync(__dirname + '/certs/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/certs/fullchain.pem'),
};

var server = https.createServer(options, app).listen(port, function(){
    console.log(`server started at port ${port}`);
});

const FINGERPRINTSET = [
  '49:CC:BF:89:83:99:91:AC:B4:CA:26:DB:01:41:CA:4C:A5:38:27:39'
];


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static("asset"));

app.use('/asset', express.static(__dirname + '/assets'));

app.use(express.static("assets"));

app.use('/assets', express.static(__dirname + '/assets'));

app.use(session({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: false
}));

let routes = require('./tsmb_route') //importing route

routes(app)

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
})


// app.listen(port)

// console.log('RESTful API server started on: ' + port)
// console.log('ENV: ' + process.env.NODE_ENV)
