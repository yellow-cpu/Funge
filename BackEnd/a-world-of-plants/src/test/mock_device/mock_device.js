var awsIot = require('aws-iot-device-sdk');

/**
 * ========== Funge Mock Device ==========
 *
 * Download the "private.pem.key" and "certificate.pem.crt"
 * of the device and place them in the certs folder.
 *
 * Set the variables below
 */

var   pemName = "CabbageBox";
var thingName = "CabbageBox";

/**
 * ============================================================
 * ========== Do not change anything below this line ==========
 * ============================================================
 */

var  keyPath = './certs/' + pemName + '-private.pem.key';
var certPath = './certs/' + pemName + '-cert.pem.crt'

console.log("=======================================");
console.log("========== Funge Mock Device ==========");
console.log("=======================================");

var device = awsIot.device({
   keyPath: keyPath,
  certPath: certPath,
    caPath: './certs/root-CA.crt',
  clientId: thingName,
    region: 'us-east-1'
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

	clientTokenUpdate = device.publish("$aws/things/" + thingName + "/shadow/update", JSON.stringify(state));
	if (clientTokenUpdate === null)
	{
		console.log('update shadow failed, operation still in progress');
	}
}

device.on('connect', function() {
	console.log('connected');
	setInterval(publish, 3000);
});