'use strict';

// Register `profile` component, along with its associated controller and template
angular.module('profile').component('profile', {
  templateUrl: 'components/profile/profile.template.html',
  controller: function ProfileController($scope, $localStorage, siteService) {
    var self = this;

    self.username = $localStorage.username;
    self.email = "";

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    var params = {
      "username": self.username
    };

    var body = {};

    apigClient.usersUsernameGet(params, body)
      .then(function (result) {
        console.log("Success: " + JSON.stringify(result));
        self.email = result.data.email;
        self.username = result.data.username;
        $scope.$apply();
      }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
    });
  }
});
