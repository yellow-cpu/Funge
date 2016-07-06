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
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + result);
          });
      };
    }
  });
