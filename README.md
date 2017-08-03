# alexa-digitally-imported-skill-nodejs

An Alexa Skill for playing Digitally Imported (www.di.fm) channels using nodejs including the necessary SSL server that will need to be setup, relatively simply if you know what you are doing - basically if you can set up a skill you should be able to do this.

This will require a premium DI.FM account

## How to Start 
#### So many steps skipped along the way, if you need any help feel free to email me

1. Clone the project and package the skill

```bash
git clone https://github.com/nikkennedy/alexa-digitally-imported-skill-nodejs.git
cd alexa-digitally-imported-skill-nodejs
npm install
```
2. Create or login to [Amazon Developer Account](https://developer.amazon.com). In the Developer Console:

    1. Create an Alexa Skill name it what you like and set an suitable invocation name "digitally imported" works well. Please note make sure the language is set to English (U.K) as it did not seem to work with U.S. (this may actually be different in the US but havn't tried it. Let me know.
  
    2. Make sure use Audio Player is set to "Yes"
  
    3. Use the Interaction Model Builder to create an intent called "PlayAudioIntent" 
        * add the utterance "play {channelName} channel" 
        * create the slot channelName with a slot type of ST_CHANNEL_NAME
        * add a few channel names such as "classic trance" "ambient" "epic trance" "trance" to the slot values for ST_CHANNEL_NAME

    4. Configuration
    You will need to have a internet reachable HTTPS server of your own which has the server running on it, now this is easily setup so long as you have a domain name thats yours - if you don't have an SSL certificate - DO NOT worry or go out and pay extortionate amounts of money for one, thankfully [Lets Encrypt](https://letsencrypt.org/) exists, follow the guides on their to setup your SSL certificate and then once you have the privatekey and certificate place those in a the sslcert directory.
        * set the service end point to HTTPS and give your servers <external URL>/alexa in the box such as https://www.mydomain.com/alexa
      
  
  3. Alter the config.js file and fill in your details
  ```bash
node server.js
```


