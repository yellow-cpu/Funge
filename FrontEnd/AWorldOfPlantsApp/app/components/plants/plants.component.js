'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
  templateUrl: 'components/plants/plants.template.html',
  controller: function PlantsController($scope, $localStorage, siteService) {
    var self = this;

    self.newPlant = {
      username: $localStorage.username,
      plantType: "",
      plantName: "",
      plantAge: Date.now()
    };

    $scope.plantDetails = {};

    self.timeConverter = function (now){
      var a = new Date(now);
      var year = a.getFullYear();
      var month = a.getMonth() + 1;
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      return date + '/' + month + '/' + year + 'T' + hour + ':' + min + ':' + sec;
    };

    self.createPlant = function() {
      console.log(self.newPlant);

      var params = {};
      var body = self.newPlant;
      body.plantAge = self.timeConverter(Date.now());

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
        username: $localStorage.username,
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

    self.getPlants = function() {
      var params = {
        "username": $localStorage.username
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
