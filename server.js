'use strict';

var config     = require('./config');
var express    = require('express');
var https      = require('https');
var fs         = require('fs');
var bodyParser = require('body-parser');
var context    = require('aws-lambda-mock-context');
var request    = require('request');

var lambdaFunc = require('./lambdaDIFM');

const serverPort = config.httpsServer.internalPort;//7685;
const serverIP   = config.httpsServer.internalIP;//"192.168.2.98";

// SSL Certificate - highly recommend using a free (yes free) letsencrypt.org ssl certificate
var privateKey  = fs.readFileSync("./sslcert/privkey.pem", 'utf8');
var certificate = fs.readFileSync("./sslcert/fullchain.pem", 'utf8');
var credentials = {key: privateKey, cert: certificate};

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

// https://<externalURL>/alexa is where you point your skill 
app.post('/alexa/', function (req, res) {
    var ctx = context();
    lambdaFunc.handler(req.body,ctx);
    ctx.Promise
        .then(resp => {  return res.status(200).json(resp); })
        .catch(err => {  console.log(err); })
});

// https://<externalURL>/di/<channelname>?code=<listenKey> will return
// pipes unsecure HTTP DI.FM link to your own servers HTTPS link so that Alexa
// Skill SDK will play the audio
app.get('/di/:channel', function(req, res) {
    console.log("Channel requested is " + req.params.channel);
    var url = 'http://prem2.di.fm:80/' + req.params.channel + '?' + req.query.code;
    var proxyRequest = request(url);
    req.pipe(proxyRequest);
    proxyRequest.pipe(res);
});


// https://<externalURL>/ditest/<channelname>?code=<listenKey> will return
// OK              - channel is playable
// Not Found       - channel does not exist
// Unauthorized    - listenKey is incorrect
app.get('/ditest/:channel', function(req, res) {
    var url = 'http://prem2.di.fm:80/' + req.params.channel + '?' + req.query.code;
    request.get(url).on('response', function(response) {
        res.sendStatus(response.statusCode);
    });
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(serverPort, serverIP,function () {
    console.log('Digital Imported Alexa Skill HTTPS Server: ' + serverIP + ':' + serverPort);
});



