'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
  templateUrl: 'components/plants/plants.template.html',
  controller: function PlantsController($scope, $localStorage) {
    var self = this;

    self.plants = [];
    $scope.test = "LASKDHJLKASJD";

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
