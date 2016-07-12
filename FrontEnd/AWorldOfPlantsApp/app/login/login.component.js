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
      };

      self.logoutUser = function logoutUser(username, password) {

      };

      self.loginUser = function loginUser(username, password) {
        var apigClient = apigClientFactory.newClient();

        var params = {};

        var body = {
          "username": username,
          "password": password
        };

        apigClient.loginPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));

            var credentials = result.data.credentials;
            console.log(credentials);

            AWS.config.credentials = {
              accessKey: credentials.accessKey,
              secretKey: credentials.secretKey,
              sessionToken: credentials.sessionToken,
              region: 'us-east-1'
            };
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };
    }
  });
