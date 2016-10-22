'use strict';

// Register `register` component, along with its associated controller and template
angular.
  module('register').
  component('register', {
    templateUrl: 'components/register/register.template.html',
    controller: function RegisterController($localStorage) {
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

      self.saveLogin = function (identityId, accessKey, secretKey, sessionToken, expiration, region, username, password, streak) {
        $localStorage.identityId = identityId;
        $localStorage.accessKey = accessKey;
        $localStorage.secretKey = secretKey;
        $localStorage.sessionToken = sessionToken;
        $localStorage.expiration = expiration;
        $localStorage.region = region;
        $localStorage.username = username;
        $localStorage.password = password;
        $localStorage.loggedIn = true;
        $localStorage.streak = streak;
      };
    }
  });
