console.log('Loading function');
	// Load the AWS SDK
	var AWS = require("aws-sdk");
	
	// Set up the code to call when the Lambda function is invoked
	exports.handler = (event, context, callback) => {
		// Load the message passed into the Lambda function into a JSON object 
		var eventText = JSON.stringify(event, null, 2);
		
		// Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
		console.log("Received event:", eventText);
		
		// Variables
		var docs = event.current.state;
		console.log(docs);
		var thingName = docs.desired.thingName;
		
		// Check whether the event has a clientToken element
		//var clientToken = event.clientToken;

		if(thingName != undefined)
		{
			// Get the time of the event
			var timestamp = event.timestamp;
			if (timestamp == undefined)
			{
				timestamp = parseInt(Date.now() / 1000, 10);
			}
			console.log(timestamp);
			
			// Get the device shadow
			var iotdata = new AWS.IotData({endpoint: "a3afwj65bsju7b.iot.us-east-1.amazonaws.com"});
			iotdata.getThingShadow({thingName: thingName}, function(err, data) {
			  if (err) console.log(err, err.stack); // an error occurred
			  else                                  // successful response
			  {
					console.log("----- Thing shadow -----");
					var thingShadow = JSON.parse(data.payload);
					console.log(thingShadow);
					console.log(thingShadow.state);
					var nextUpdate = thingShadow.state.desired.next_update;
					console.log(nextUpdate);
					if(nextUpdate == undefined)
					{
					    console.log("Undefined next_update");
					    nextUpdate = timestamp - 1;
					}
			
					if(nextUpdate <= timestamp)
					{
						console.log("----- Update Shadow -----");
						// Get the time 1 hour from now
						nextUpdate = parseInt(timestamp + (60*60), 10);
						console.log(thingName);
						var updateParams = {
							payload: '{"state": {"desired": {"next_update": '+ nextUpdate + '}}}',
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
						
						console.log("----- Save Values -----");

						// Create parameters to send to DynamoDB
						var params = {
							TableName: "hourly",
							Item:{
								"plantID": thingName,
								"timestamp": timestamp
							}
						};

						// Check if the temperature item is in the event
						var temperature = docs.reported.temperature;
						if(temperature != undefined)
							params.Item.temperature = temperature;


						// Check if the humidity item is in the event
						var humidity = docs.reported.humidity;
						if(humidity != undefined)
							params.Item.humidity = humidity;
							
						// Add new item to hourly
						console.log("Adding a new item to hourly: ", params);
						docClient.put(params, function(err, data) {
							if (err) {
								console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
							} else {
								console.log("Added item:", JSON.stringify(data, null, 2));
							}
						});
					}
				}
			});
		}
		else
		{
			console.log("----- No thingName found -----");
		}
	};