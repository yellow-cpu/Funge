'use strict';

// Register `register` component, along with its associated controller and template
angular.
  module('register').
  component('register', {
    templateUrl: 'register/register.template.html',
    controller: function RegisterController($http) {
      var self = this;

      self.user = {
        "username": "test1",
        "password": "123"
      };

      self.registerUser = function registerUser(username, password) {
        var data = JSON.stringify({
          "action": "com.amazonaws.apigatewaydemo.action.RegisterDemoAction",
          "body": {
              "username": username,
              "password": password
          }
        });

        $http.post('https://60rtntlltg.execute-api.us-east-1.amazonaws.com/test/users', data).then(function(response) {
          console.log(response);
        });
      };
    }
  });
