'use strict';

// Register `things` component, along with its associated controller and template
angular.module('things').component('things', {
  templateUrl: 'components/things/things.template.html',
  controller: function ThingsController($scope, $localStorage, siteService, refreshService, $mdDialog) {
    var self = this;

    self.selectedColour = "";

    self.newThing = {
      thingName: "",
      username: $localStorage.username,
      plantId: "",
      colour: "#1D9D73"
    };

    self.plantList = [];

    self.plantSelect = "";

    self.customColors = ["#1D9D73", "#297373", "#FF8552", "#DA3E52", "#F9C80E", "#51B749", "#662E9B", "#FF5C33", "#236ACB", "#F7B32B", "#4C5B5C", "#FF5AEF"];

    self.colourOptions = {
      size: 30,
      roundCorners: true
    };

    self.apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    self.selectedThing = {
      username: $localStorage.username,
      thingName: ""
    };

    self.selectThing = function (thingName) {
      self.selectedThing.thingName = thingName;
    };

    self.updateDetails = function($event, _thingName, _username, _colour, _plantId) {
      var thingUpdate = $($event.currentTarget);

      thingUpdate.find('span').css({
        "display": "none"
      });

      thingUpdate.find('.update-spin').css({
        "display": "inline-block"
      });

      var apigUpdateDetails = function () {
        console.log($localStorage.accessKey + " " + $localStorage.expiration);

        var parms = {};
        var body = {
          "thingName":_thingName,
          "colour":_colour,
          "plantId":_plantId,
          "username":_username
        };

        self.apigClient.thingsUpdatePost(parms, body)
          .then(function (result) {
            thingUpdate.find('.update-spin').css({
              "display": "none"
            });

            thingUpdate.find('svg').css({
              "display": "block"
            });

            setTimeout(function () {
              thingUpdate.find('span').css({
                "display": "inline"
              });

              thingUpdate.find('svg').css({
                "display": "none"
              });
            }, 3000);
            console.log(result);
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
      };

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigUpdateDetails();
        });
      } else {
        apigUpdateDetails();
      }
    };

    self.getUserPlants = function () {
      var params = {
        "username": $localStorage.username
      };

      var body = {};

      self.apigClient.plantsUserUsernameGet(params, body)
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
    };

    self.removeThing = function (_thingName, _username) {
      var apigRemoveThing = function () {
        var params = {};

        var body = {
          "thingName": _thingName,
          "username": _username
        };

        self.apigClient.thingsDeletePost(params, body)
          .then(function (result) {
            console.log(result.data);

            for (var i = 0; i < self.things.length; ++i) {
              if (self.things[i].thingName == _thingName) {
                self.things.splice(i, 1);
              }
            }

            $scope.$apply();
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
      };

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigRemoveThing();
        });
      } else {
        apigRemoveThing();
      }
    };

    self.selectPlant = function (plantId) {
      var apigSelectPlant = function () {
        var params = {
          "plantId": plantId
        };
        var body = {};

        self.apigClient.plantsPlantIdGet(params, body)
          .then(function (result) {
            console.log("Success: " + JSON.stringify(result.data));

            siteService.setPlant(result.data);

            window.location = "/#/site/plants/plant-detail/" + plantId;
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });

        console.log(plantId);
      };

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigSelectPlant();
        });
      } else {
        apigSelectPlant();
      }
    };

    self.createThing = function() {
      if (self.newThing.thingName == "" || self.newThing.plantId == "") {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Empty Plant')
            .textContent('Please fill in all details for your new plant!')
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok!')
        );
      } else {
        var apigCreateThing = function () {
          var params = {};
          var body = self.newThing;

          console.log(body);

          self.apigClient.thingsPost(params, body)
            .then(function (result) {
              console.log("Success: " + JSON.stringify(result.data));

              var tempArr = formatFiles([result.data.thing]);
              tempArr[0].selectedPlant = tempArr[0].plantId;
              self.things.push(tempArr[0]);
              $scope.$apply();
            }).catch(function (result) {
            console.log("Error: " + JSON.stringify(result));
          });
        };

        if (refreshService.needsRefresh($localStorage.expiration)) {
          refreshService.refresh($localStorage.username, $localStorage.password, function () {
            self.apigClient = apigClientFactory.newClient({
              accessKey: $localStorage.accessKey,
              secretKey: $localStorage.secretKey,
              sessionToken: $localStorage.sessionToken,
              region: $localStorage.region
            });

            apigCreateThing();
          });
        } else {
          apigCreateThing();
        }
      }
    };

    var formatFiles = function(thingArr) {
      console.log(thingArr);
      var tempThingArr = thingArr;

      for (var i = 0; i < tempThingArr.length; ++i) {
        var fileNames = [];
        for (var j = 0; j < tempThingArr[i].files.length; ++j) {
          var indexOfFileName = tempThingArr[i].files[j].split('/', 6).join('/').length;
          fileNames.push(tempThingArr[i].files[j].substring(indexOfFileName + 1));
        }
        tempThingArr[i].fileNames = fileNames;
        console.log(tempThingArr[i].fileNames);
      }

      return tempThingArr;
    };


    self.getThings = function() {
      var params = {
        "username": $localStorage.username
      };

      $(".loader-container").css({
        'display': 'block'
      });

      var body = {};

      self.apigClient.thingsUserUsernameGet(params, body)
        .then(function (result) {
          $(".loader-container").css({
            'display': 'none'
          });

          self.things = result.data.things;

          if (self.things.length >= 1) {
            formatFiles(self.things);
          }

          for (var i = 0; i < self.things.length; ++i) {
            self.things[i].selectedPlant = self.things[i].plantId;
          }

          $scope.$apply();
        }).catch(function (result) {
          console.log(result);
      });
    };
  }
});
