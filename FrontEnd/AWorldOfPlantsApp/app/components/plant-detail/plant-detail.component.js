'use strict';

// Register `plantDetail` component, along with its associated controller and template
angular.module('plantDetail').component('plantDetail', {
  templateUrl: 'components/plant-detail/plant-detail.template.html',
  controller: function PlantDetailController($scope, $localStorage, siteService) {
    var self = this;

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    self.plantDetails = siteService.getPlant();

    self.updatePlant = function() {
      var params = {};
      var body = self.plantDetails;

      apigClient.plantsUpdatePost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
    };

    console.log("123");

    self.deletePlant = function() {
      var params = {
        plantId: self.plantDetails.plantId
      };

      var body = {};

      apigClient.plantsDeletePlantIdGet(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
