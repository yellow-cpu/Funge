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
      colour: ""
    };

    self.plantIdList = [];

    self.customColors = ["#1d9d73", "#297373", "#FF8552", "#DA3E52", "#F9C80E", "#51b749", "#662E9B", "#A33B20", "#236acb", "#F7B32B", "#4C5B5C", "#ff5aef"];

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
  }
});
