'use strict';

// Register `things` component, along with its associated controller and template
angular.module('things').component('things', {
  templateUrl: 'components/things/things.template.html',
  controller: function ThingsController($scope, $localStorage, siteService) {
    var self = this;

    self.newThing = {
      thingName: "",
      username: $localStorage.username,
      plantId: ""
    };

    self.plantIdList = [];

    self.customColors = ["#1d9d73", "#5484ed", "#a4bdfc", "#46d6db", "#7ae7bf", "#51b749", "#fbd75b", "#ffb878", "#ff887c", "#dc2127", "#dbadff", "#e1e1e1"];

    self.selectedColour = "";

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

      apigClient.thingsPost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result.data));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
