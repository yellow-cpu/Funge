'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
  templateUrl: 'components/plants/plants.template.html',
  controller: function PlantsController($scope, $localStorage, siteService) {
    var self = this;

    self.newPlant = {
      username: "dill2",
      plantType: "Strawberry",
      plantName: "Bert",
      plantAge: 0
    };

    $scope.plantDetails = {};

    self.createPlant = function() {
      console.log(self.newPlant);

      var params = {};
      var body = self.newPlant;

      apigClient.plantsPost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result.data));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };

    self.updateDetails = function(_plantId, _plantType, _plantName, _plantAge) {
      $scope.plantDetails = {
        plantId: _plantId,
        plantType: _plantType,
        plantName: _plantName,
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

    self.update = function() {
      var params = {};

      var body = {
        plantId: "5b45cfe3-74ed-44c4-9872-49f4d41b3ef2",
        username: "bob",
        plantType: "Flower",
        plantName: "Blue",
        plantAge: 5
      };

      apigClient.plantsUpdatePost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };

    self.delete = function() {
      console.log("Delete called");

      var params = {
        "plantId": "aa2d22b0-8aa4-46a8-8b13-f5fe6bc251da"
      };

      var body = {};

      apigClient.plantsDeletePlantIdGet(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
      });
    };

    self.test = function() {
      console.log("Test called");
      var params = {
        "username": "dill2"
      };

      var body = {};

      apigClient.plantsUserUsernameGet(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
          console.log("xxx");
          self.plants = result.data.plants;
          $scope.$apply();
        }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});