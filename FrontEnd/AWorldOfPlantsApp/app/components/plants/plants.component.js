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
      plantAge: Date.now(),
      colour: "#1D9D73"
    };

    $scope.plantDetails = {};

    self.customColors = ["#1D9D73", "#297373", "#FF8552", "#DA3E52", "#F9C80E", "#51B749", "#662E9B", "#FF5C33", "#236ACB", "#F7B32B", "#4C5B5C", "#FF5AEF"];

    self.colourOptions = {
      size: 30,
      roundCorners: true
    };

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

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
      "November", "December"];

    self.createPlant = function() {
      console.log(self.newPlant);

      var params = {};
      var body = self.newPlant;
      body.plantAge = self.timeConverter(Date.now());

      apigClient.plantsPost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result.data));

          var createdPlant = result.data.plant;

          createdPlant.plantDay = createdPlant.plantAge.substring(0, createdPlant.plantAge.indexOf('/'));
          createdPlant.plantMonth = months[createdPlant.plantAge.split('/')[1] - 1];
          createdPlant.plantYear = createdPlant.plantAge.split('/')[2];
          createdPlant.plantYear = createdPlant.plantYear.substring(0, createdPlant.plantYear.indexOf('T'));

          self.plants.push(createdPlant);

          $scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };

    self.updateDetails = function(_plantId, _plantType, _plantName, _plantAge, _colour) {
      $scope.plantDetails = {
        plantId: _plantId,
        username: $localStorage.username,
        plantType: _plantType,
        plantName: _plantName,
        plantAge: _plantAge,
        colour: _colour
      };

      siteService.setPlant($scope.plantDetails);
      // self.viewDetails();
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

      $(".loader-container").css({
        'display': 'block'
      });

      apigClient.plantsUserUsernameGet(params, body)
          .then(function (result) {
            $(".loader-container").css({
              'display': 'none'
            });
            self.plants = result.data.plants;

            for (var i = 0; i < self.plants.length; ++i) {
              self.plants[i].plantDay = self.plants[i].plantAge.substring(0, self.plants[i].plantAge.indexOf('/'));
              self.plants[i].plantMonth = months[self.plants[i].plantAge.split('/')[1] - 1];
              self.plants[i].plantYear = self.plants[i].plantAge.split('/')[2];
              self.plants[i].plantYear = self.plants[i].plantYear.substring(0, self.plants[i].plantYear.indexOf('T'));
            }

            console.log(self.plants);

            $scope.$apply();
          }).catch(function (result) {
            console.log("Error: " + JSON.stringify(result));
      });
    };

    $scope.getPlantTypes = function(search) {
      if (self.plants === undefined) self.plants = []
      $scope.plantTypes = self.plants.map(x => x.plantType).sort();

      var newTypes = $scope.plantTypes.slice();

      if (search && newTypes.indexOf(search) === -1) {
        newTypes.unshift(search);
      }

      return newTypes;
    }

  }
});
