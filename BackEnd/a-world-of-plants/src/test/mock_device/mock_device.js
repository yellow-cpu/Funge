var awsIot = require('aws-iot-device-sdk');

console.log("is it working?");

var device = awsIot.device({
   keyPath: './certs/1085ac50a4-private.pem.key',
  certPath: './certs/1085ac50a4-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'MockDevice',
    region: 'eu-east-1'
});

var temperature = 0;
var humidity    = 0;
var moisture    = 0;

function getRandom(min, max) { return Math.random() * (max - min) + min; }

function randomizeValues() {
	temperature = getRandom(10, 28);
	humidity    = getRandom(30, 50);
	moisture    = getRandom(200, 500);
}

function publish() {
	randomizeValues();

	var state = {
		"state": {
			"reported": {
				"temperature":	temperature,
				"humidity":		humidity,
				"moisture":		moisture
			}
		}
	};

	console.log(JSON.stringify(state));

	clientTokenUpdate = device.publish('mock/test', JSON.stringify(state));
	if (clientTokenUpdate === null)
	{
		console.log('update shadow failed, operation still in progress');
	}
}

device.on('connect', function() {
	console.log('connected');
	//setInterval(publish(), 3000);
});
/*
*/