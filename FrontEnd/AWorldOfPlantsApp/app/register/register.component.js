'use strict';

// Register `register` component, along with its associated controller and template
angular.
  module('register').
  component('register', {
    templateUrl: 'register/register.template.html',
    controller: function RegisterController() {
      var self = this;

      self.user = {
        "username": "test1",
        "password": "123"
      };

      self.registerUser = function registerUser(username, password) {
        var apigClient = apigClientFactory.newClient();

        var params = {
          "action": "cf.funge.aworldofplants.action.RegisterAction"
        };

        var body = {
          "username": username,
          "password": password
        };

        apigClient.usersPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result));
          }).catch( function(result){
            console.log("Error: " + result);
        });
      };
    }
  });
