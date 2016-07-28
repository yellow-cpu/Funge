console.log('Loading function');
// Load the AWS SDK
var AWS = require("aws-sdk");

// Set up the code to call when the Lambda function is invoked
exports.handler = (event, context, callback) => {
    // Load the message passed into the Lambda function into a JSON object 
    var eventText = JSON.stringify(event, null, 2);
    
    // Log a message to the console, you can view this text in the Monitoring tab in the Lambda console or in the CloudWatch Logs console
    console.log("Received event:", eventText);
    
    // Create a string extracting the click type and serial number from the message sent by the AWS IoT button
    var messageText = "Red: " + event.state.red + " Green: " + event.state.green + " Blue: " + event.state.blue;
    
    // Save the Red, Green and Blue values
    var clientToken = event.clientToken;
    if(clientToken != undefined)
    {
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        var table = "rgb";
        var red = event.state.red;
        var blue = event.state.blue;
        var green = event.state.green;
        
        var params = {
            TableName:table,
            Item:{
                "timestamp": timestamp,
                "clientToken": clientToken,
                "info":{
                    "red": red,
                    "blue": blue,
                    "green": green
                }
            }
        };
        
        console.log("Adding a new item...");
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    }
 
    
    // Write the string to the console
    console.log("Message to send: " + messageText);
    /*
    // Crewate an SNS object
    var sns = new AWS.SNS();
    
    // Populate the parameters for the publish operation
    // - Message : the text of the message to send
    // - TopicArn : the ARN of the Amazon SNS topic to which you want to publish 
    var params = {
        Message: messageText,
        TopicArn: "arn:aws:sns:us-east-1:123456789012:MyIoTButtonSNSTopic"
     };
     sns.publish(params, context.done);
     */
};