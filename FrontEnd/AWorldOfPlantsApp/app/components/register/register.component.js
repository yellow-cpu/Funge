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

      self.saveLogin = function (identityId, accessKey, secretKey, sessionToken, region, username) {
        $localStorage.identityId = identityId;
        $localStorage.accessKey = accessKey;
        $localStorage.secretKey = secretKey;
        $localStorage.sessionToken = sessionToken;
        $localStorage.region = region;
        $localStorage.username = username;
        $localStorage.loggedIn = true;
      };

      // self.registerUser = function registerUser(email, username, password) {
      //   var apigClient = apigClientFactory.newClient();
      //
      //   var params = {};
      //
      //   var body = {
      //     "email" : email,
      //     "username": username,
      //     "password": password
      //   };
      //
      //   apigClient.usersPost(params, body)
      //     .then(function(result){
      //       console.log("Success: " + JSON.stringify(result));
      //       window.location.replace("#!/site");
      //     }).catch( function(result){
      //       console.log("Error: " + JSON.stringify(result));
      //   });
      // };
    }
  });
