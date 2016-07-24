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

    var params = {};
    var body = {};

    self.getPlantId = function getPlantId(plantId) {
      var params = {
        "plantId": plantId
      };

      var body = {};

      apigClient.plantsPlantIdGet(params, body)
        .then(function(result){
          console.log("Success: " + JSON.stringify(result.data));
          self.thePlant = JSON.stringify(result.data.plantName);
          $scope.$apply();
        }).catch( function(result){
          console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
