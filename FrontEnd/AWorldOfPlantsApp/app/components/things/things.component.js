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

    self.plantList = [];

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

    self.updateDetails = function(_thingName, _username, _colour, _plantId) {
      var parms = {};
      var body = {
        "thingName":_thingName,
        "colour":_colour,
        "plantId":_plantId,
        "username":_username
      };

      apigClient.thingsUpdatePost(parms, body)
        .then(function (result) {
        console.log(result);
      }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };

    var params = {
      "username": $localStorage.username
    };

    var body = {};

    apigClient.plantsUserUsernameGet(params, body)
      .then(function (result) {
        var plants = result.data.plants;
        
        self.plantList = [];

        for (var i = 0; i < plants.length; ++i) {
          self.plantList.push(plants[i]);
        }
        $scope.$apply();
      }).catch(function (result) {
      console.log("Error: " + JSON.stringify(result));
    });

    self.removeThing = function (_thingName, _username) {
      var params = {};

      var body = {
        "thingName": _thingName,
        "username": _username
      };

      apigClient.thingsDeletePost(params, body)
        .then(function (result) {
          console.log(result.data);
        }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
      });
    };

    self.createThing = function() {
      var params = {};
      var body = self.newThing;

      console.log(body);

      apigClient.thingsPost(params, body)
        .then(function (result) {
          console.log(result);

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

          if (self.things.length >= 1) {
            for (var i = 0; i < self.things.length; ++i) {
              var indexOfFileName = self.things[i].files[i].split('/', 6).join('/').length;
              var fileNames = [];
              for (var j = 0; j < self.things[i].files.length; ++j) {
                fileNames.push(self.things[i].files[j].substring(indexOfFileName + 1));
              }
              console.log(fileNames);
              self.things[i].fileNames = fileNames;
              console.log(self.things[i].fileNames);
            }
          }

          console.log(self.things);
          $scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
