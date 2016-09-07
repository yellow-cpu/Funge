'use strict';

// Register `things` component, along with its associated controller and template
angular.module('things').component('things', {
  templateUrl: 'components/things/things.template.html',
  controller: function ThingsController($scope, $localStorage, siteService) {
    var self = this;

    self.selectedColour = "";

    self.newThing = {
      thingName: "",
      username: $localStorage.username,
      plantId: "",
      colour: "#1D9D73"
    };

    self.plantIdList = [];

    self.customColors = ["#1D9D73", "#297373", "#FF8552", "#DA3E52", "#F9C80E", "#51B749", "#662E9B", "#FF5C33", "#236ACB", "#F7B32B", "#4C5B5C", "#FF5AEF"];

    self.colourOptions = {
      size: 30,
      roundCorners: true
    };

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    self.createThing = function() {
      var params = {};
      var body = self.newThing;

      console.log(body);

      apigClient.thingsPost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result.data));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };

    self.getThings = function() {
      var params = {
        "username": $localStorage.username
      };

      $(".loader-container").css({
        'display': 'block'
      });

      var body = {};

      apigClient.thingsUserUsernameGet(params, body)
        .then(function (result) {
          $(".loader-container").css({
            'display': 'none'
          });
          self.things = result.data.things;
          console.log(self.things);
          $scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
