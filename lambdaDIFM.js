'use strict';

var config  = require('./config');
var Alexa   = require('alexa-sdk');
var async   = require('async');
var request = require("request");

const defaultChannelName = 'epic trance';
const difmAPICode        = config.diFM.listenKey;
const audioURL           = config.httpsServer.externalURL + '/di';
const audioTestURL       = config.httpsServer.externalURL + '/ditest';

var channelName          = '';

function Launch(alexa)
{
    alexa.response.speak("tell Digital Imported what type of channel to play");
    Stop(alexa);
}

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = config.alexa.appID;
    if(event.context && event.context.System.application.applicationId == 'applicationId') {
        event.context.System.application.applicationId = event.session.application.applicationId;
    }    
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function PlayChannel(alexa)
{
    alexa.response.speak("Playing " + channelName);

    var url = "https://" + audioURL + "/" + channelName.replace(/\s+/g, '') + "?code=" + difmAPICode;

    alexa.response.audioPlayerPlay('REPLACE_ALL', url, "token", null, 0);
}

function Play(alexa)
{
    var functions = [];

    // if a channel is not already set set it to the default 
    if(channelName == "") {
        channelName = defaultChannelName;
    }

    // if a channelName slot is filled then use this value
    if(alexa.event.request.intent.slots) {
        if(alexa.event.request.intent.slots.channelName) {
            channelName = alexa.event.request.intent.slots.channelName.value;    
        }
    }

    var urlTest = "https://" + audioTestURL + "/" + channelName.replace(/\s+/g, '') + "?code=" + difmAPICode;

    request.get(urlTest, function(error, response, body) {

        if(body == "OK") { // does channel exist
            console.log("Playing " + channelName + " channel");
            PlayChannel(alexa);
        } else {
            alexa.response.speak("Digital imported does not have a " + channelName + " channel");
            console.log("DI.FM does not have " + channelName + " channel");
            Stop(alexa);
        }

        alexa.emit(':responseReady');
    });    

}

function Stop(alexa)
{
    alexa.response.audioPlayerStop();
    alexa.emit(':responseReady');
}

var handlers = {

    'LaunchRequest': function() {
        Launch(this);
    },

    'Unhandled' : function() {
        this.emit(':responseReady'); // ignore everything else
    },

    'AMAZON.CancelIntent' : function() {
        Stop(this);
    },

    'PlayAudioIntent' : function() {
        Play(this);
    },

    'AMAZON.StopIntent' : function() {
        Stop(this);
    },

    'AMAZON.PauseIntent' : function() {
        Stop(this);
    },

    'AMAZON.ResumeIntent' : function() {
        Play(this);
    },



  
};