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
                    var temperature = {};   var temperatureCount    = 0;
                    var humidity    = {};   var humidity count      = 0;
                    
                    data.Items.foreach(function(record)
                        {
                            console.log(record);
                            // Add temperature
                            if(record.temperature)
                            {
                                // Increment counter
                                temperatureCount ++;
                                
                                // Create entry if plantID is not in array
                                if(!temperature[record.plantID])
                                    temperature[record.plantID] = {"total": 0};
                                // Add value to total
                                temperature[record.plantID].total += record.temperature;
                                
                                // Add startTime
                                if(!temperature[record.plantID].startTime || record.timestamp < temperature[record.plantID].startTime)
                                    temperature[record.plantID].startTime = record.timestamp;
                                    
                                // Add endTime
                                if(!temperature[record.plantID].endTime || record.timestamp > temperature[record.plantID].endTime)
                                    temperature[record.plantID].endTime = record.timestamp;
                            }
                            
                            // Add humidity
                            if(record.humidity)
                            {
                                // Increment counter
                                humidityCount ++;
                                
                                // Create entry if plantID is not in array
                                if(!humidity[record.plantID])
                                    humidity[record.plantID] = {"total": 0};
                                // Add value to total
                                humidity[record.plantID].total += record.humidity;
                                
                                // Add startTime
                                if(!humidity[record.plantID].startTime || record.timestamp < humidity[record.plantID].startTime)
                                    humidity[record.plantID].startTime = record.timestamp;
                                    
                                // Add endTime
                                if(!humidity[record.plantID].endTime || record.timestamp > humidity[record.plantID].endTime)
                                    humidity[record.plantID].endTime = record.timestamp;
                            }
                        });
                }
            });
        /*
        var temperature = event.state.reported.temperature;
        if(temperature != undefined)
        {
            // Create parameters to send to DynamoDB
            var params = {
                TableName: "temperature",
                Item:{
                    "clientToken": thingName,
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
        */
    };