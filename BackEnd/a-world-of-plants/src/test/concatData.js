console.log('Loading function');
	// Load the AWS SDK
	var AWS = require("aws-sdk");
	
	// Set up the code to call when the Lambda function is invoked
	exports.handler = (event, context, callback) => {
		// Load the message passed into the Lambda function into a JSON object 
		var eventText = JSON.stringify(event, null, 2);
		
		// Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
		console.log("Received event:", eventText);
		
		// Create the DynamoDB Document Client to connect to DynamoDB
		var docClient = new AWS.DynamoDB.DocumentClient();
		
		console.log("----- Scanning table: hourly -----");
		
		// Check if the temperature item is in the event
		docClient.scan({TableName: "hourly"}, function(data, err)
		{
			if(err) console.log(err);
			else
			{
				// Initialize arrays to store concat data
				var temperature = {};
				var humidity    = {};
				
				data.Items.foreach(function(record)
				{
					console.log(record);
					// Add temperature
					if(record.temperature)
					{                        
						// Create entry if plantID is not in array
						if(!temperature[record.plantID])
							temperature[record.plantID] = {"total": 0, "count": 0};

						//Increment counter
						temperature[record.plantID].count++;

						// Add value to total
						temperature[record.plantID].total += record.temperature;
						
						// Add startTime
						if(!temperature[record.plantID].startTime || record.timestamp < temperature[record.plantID].startTime)
							temperature[record.plantID].startTime = record.timestamp;
							
						// Add endTime
						if(!temperature[record.plantID].endTime || record.timestamp > temperature[record.plantID].endTime)
							temperature[record.plantID].endTime = record.timestamp;

						// Add min
						if(!temperature[record.plantID].min || record.temperature < temperature[record.plantID].min)
							temperature[record.plantID].min = record.temperature;

						// Add max
						if(!temperature[record.plantID].max || record.temperature > temperature[record.plantID].max)
							temperature[record.plantID].max = record.temperature;
					}
					
					// Add humidity
					if(record.humidity)
					{
						// Create entry if plantID is not in array
						if(!humidity[record.plantID])
							humidity[record.plantID] = {"total": 0, "count": 0};

						//Increment counter
						humidity[record.plantID].count++;

						// Add value to total
						humidity[record.plantID].total += record.humidity;
						
						// Add startTime
						if(!humidity[record.plantID].startTime || record.timestamp < humidity[record.plantID].startTime)
							humidity[record.plantID].startTime = record.timestamp;
							
						// Add endTime
						if(!humidity[record.plantID].endTime || record.timestamp > humidity[record.plantID].endTime)
							humidity[record.plantID].endTime = record.timestamp;

						// Add min
						if(!humidity[record.plantID].min || record.humidity < humidity[record.plantID].min)
							humidity[record.plantID].min = record.humidity;

						// Add max
						if(!humidity[record.plantID].max || record.humidity > humidity[record.plantID].max)
							humidity[record.plantID].max = record.humidity;
					}

					// Remove record from table
					var params =
					{
						TableName: "hourly",
						Key:
						{
							plantID: record.plantID,
							timestamp: record.timestamp
						}
					}

					docClient.delete(params, function(data, err)
					{
						if (err)	console.log(err);
						else		console.log(data);
					});
				});

				// Add temperature to daily table
				for(var key in temperature)
				{
					var params =
					{
						TableName: "temperatureDaily",
						Item:
						{
							"plantID":		key,
							"startTime":	temperature[key].startTime,
							"endTime":		temperature[key].endTime,
							"avg":			(temperature[key].total / temperature[key].count),
							"min":			temperature[key].min,
							"max":			temperature[key].max
						}
					}
				}

				// Add humidity to daily table
				for(var key in humidity)
				{
					var params =
					{
						TableName: "humidityDaily",
						Item:
						{
							"plantID":		key,
							"startTime":	humidity[key].startTime,
							"endTime":		humidity[key].endTime,
							"avg":			(humidity[key].total / humidity[key].count),
							"min":			humidity[key].min,
							"max":			humidity[key].max
						}
					}
				}
			}
		});
	};