// config file - alter this to reflect your setup

module.exports = {
	httpsServer : {
		// this is the internal IP address, your router should point the external port 443 to this 
		// address and port
		internalIP   : <YOUR IP ADDRESS>,  // e.g. '192.168.10.49'              
		internalPort : <PORT>,             // e.g. 443         
		// this is the external domain name that points to your server
		externalURL  : <URL>               // e.g. 'www.mydomainname.com'
	},

	diFM : {
		// your premium listen key - found on bottom of www.di.fm/settings
		listenKey : '<LISTEN KEY HERE>'
	},

	alexa : {
		// your skill api skill - found on skill Information panel 
		appID : '<APP ID>'
	}

}