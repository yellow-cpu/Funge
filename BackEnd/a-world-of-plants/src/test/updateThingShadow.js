console.log('Loading function');

var AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var thingName = event.thingName;
    console.log('thingName: ' + thingName);
    var shadow = JSON.stringify(event.shadow, null, 2);
    console.log('Shadow: ', shadow);
    
    var iotdata = new AWS.IotData({endpoint: "a3afwj65bsju7b.iot.us-east-1.amazonaws.com"});
    
    console.log('Generating Params...');
    var updateParams = {
		payload: shadow,
		thingName: thingName
	};
	console.log('Updating Shadow...');
	iotdata.updateThingShadow(updateParams,
	    function(err, data)
		{
			if(err) console.log(err, err.stack);
			else    console.log(data);
		});
	console.log('Shadow Updated');
};