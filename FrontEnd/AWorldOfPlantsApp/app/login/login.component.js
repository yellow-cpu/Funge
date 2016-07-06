'use strict';

// Register `login` component, along with its associated controller and template
angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    controller: function LoginController() {
      var self = this;

      self.user = {
        "username": "test1",
        "password": "123"
      }

      self.loginUser = function loginUser(username, password) {
        var apigClient = apigClientFactory.newClient();

        var params = {
          "action": "com.amazonaws.apigatewaydemo.action.LoginDemoAction"
        };

        var body = {
          "username": username,
          "password": password
        };

        apigClient.loginPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data.identityId));

            AWS.config.region = 'us-east-1';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
               IdentityPoolId: 'us-east-1:01d06c3d-957e-4db3-a37b-35d7b3e6bef5',
               IdentityId: JSON.stringify(result.data.identityId),
               Logins: {
                  'cognito-identity.amazonaws.com': JSON.stringify(result.data.token)
               }
            });
          }).catch( function(result){
            console.log("Error: " + result);
          });
      };
    }
  });
