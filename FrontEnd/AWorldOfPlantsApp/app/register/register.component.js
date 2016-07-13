'use strict';

// Register `register` component, along with its associated controller and template
angular.
  module('register').
  component('register', {
    templateUrl: 'register/register.template.html',
    controller: function RegisterController() {
      var self = this;

      self.user = {
        "email": "",
        "username": "",
        "password": "",
        "confirmPassword": ""
      };

      self.switchToLogin = function switchToLogin() {
        $('#my-tab-content').html('<login></login>');
      };

      // Test function
      self.directiveToCtrl = function (email, username, password) {
        console.log(email + " " + username + " " + password);
      };

      self.registerUser = function registerUser(username, password) {
        var apigClient = apigClientFactory.newClient();

        var params = {};

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
