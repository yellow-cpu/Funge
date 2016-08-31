console.log('Loading function');
	// Load the AWS SDK
	var AWS = require("aws-sdk");
	
	// Set up the code to call when the Lambda function is invoked
	exports.handler = (event, context, callback) => {
		// Load the message passed into the Lambda function into a JSON object 
		var eventText = JSON.stringify(event, null, 2);
		
		// Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
		console.log("Received event:", eventText);
		
		// Check whether the event has a clientToken element
		var clientToken = event.clientToken;
		if(clientToken != undefined)
		{
			// Get the time of the event
			var timestamp = event.timestamp;
			if (timestamp == undefined)
			{
				timestamp = Date.now();
			}
			console.log(timestamp);
			
			console.log("----- Update Shadow -----");
			// Get the device shadow
			var iotdata = new AWS.IotData({endpoint: "a3afwj65bsju7b.iot.us-east-1.amazonaws.com"});
			// Get the time 1 hour from now
			var nextUpdate = (timestamp);
			var thingName = event.state.reported.thingName;
			console.log(thingName);
			var updateParams = {
				payload: '{"state": {"reported": {"next_update": '+ nextUpdate + '}}}',
				thingName: thingName
			};
			// Update shadow
			iotdata.updateThingShadow(updateParams, function(err, data)
													{
														if(err) console.log(err, err.stack);
														else    console.log(data);
													});
			
			// Create the DynamoDB Document Client to connect to DynamoDB
			var docClient = new AWS.DynamoDB.DocumentClient();
			
			console.log("----- Save Temperature -----");
			// Check if the temperature item is in the event
			var temperature = event.state.reported.temperature;
			if(temperature != undefined)
			{
				// Create parameters to send to DynamoDB
				var params = {
					TableName: "temperature",
					Item:{
						"clientToken": clientToken,
						"timestamp": timestamp,
						"temperature": temperature
					}
				};
				
				// Add new item to temperature
				console.log("Adding a new item to temperature...");
				docClient.put(params, function(err, data) {
					if (err) {
						console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
					} else {
						console.log("Added item:", JSON.stringify(data, null, 2));
					}
				});
			}
			
			console.log("----- Save Humidity -----");
			// Check if the humidity item is in the event
			var humidity = event.state.reported.humidity;
			if(humidity != undefined)
			{
				// Create parameters to send to DynamoDB
				var params = {
					TableName: "humidity",
					Item:{
						"clientToken": clientToken,
						"timestamp": timestamp,
						"humidity": humidity
					}
				};
				
				// Add new item to humidity
				console.log("Adding a new item to humidity...");
				docClient.put(params, function(err, data) {
					if (err) {
						console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
					} else {
						console.log("Added item:", JSON.stringify(data, null, 2));
					}
				});
			}
		}
	};