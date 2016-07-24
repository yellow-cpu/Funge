'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
  templateUrl: 'components/plants/plants.template.html',
  controller: function PlantsController($scope, $localStorage, siteService) {
    var self = this;

    $scope.plantDetails = {};

    self.test = "TEST";
    $scope.test1 = "TEST1";

    self.updateDetails = function(_plantId, _plantName, _plantType, _plantAge) {
      $scope.plantDetails = {
        plantId: _plantId,
        plantName: _plantName,
        plantType: _plantType,
        plantAge: _plantAge
      };

      siteService.setPlant($scope.plantDetails);
      self.viewDetails();
    };

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    var params = {};

    var body = {};

    apigClient.plantsGet(params, body)
      .then(function (result) {
        console.log("Success: " + JSON.stringify(result.data));
        self.plants = result.data.plants;
        $scope.$apply();
      }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
    });
  }
});
