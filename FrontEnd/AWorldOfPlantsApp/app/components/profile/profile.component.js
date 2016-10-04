'use strict';

// Register `profile` component, along with its associated controller and template
angular.module('profile').component('profile', {
  templateUrl: 'components/profile/profile.template.html',
  controller: function ProfileController($scope, $localStorage, siteService) {
    var self = this;

    // User variables
    self.username = $localStorage.username;
    self.email = "";

    // Timeline variables
    self.timelineEvents = [];

    // Card variables
    self.numPlants      = 0;
    self.numPlantBoxes  = 0;
    self.points         = 0;

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    var params = {
      "username": self.username
    };

    var body = {};

    self.timeConverter = function (now){
      var a = new Date(now * 1000);
      var year = a.getFullYear();
      var month = a.getMonth() + 1;
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      return date + '/' + month + '/' + year + ' at ' + hour + ':' + min;
    };

    apigClient.usersUsernameGet(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
          self.email = result.data.email;
          self.username = result.data.username;
          $scope.$apply();
        }).catch(function (result) {
      console.log("Error: " + JSON.stringify(result));
    });

    $(".timeline-wrapper").css({
      'display': 'none'
    });

    $(".loader-container").css({
        'display': 'block'
    });

    $(".card-loader").css({
      'display': 'block'
    });

    $(".card").css({
      'display': 'none'
    });

    // Get timeline events of current user
    self.getTimelineEvents = function() {
      apigClient.timelineUsernameGet(params, body)
          .then(function (result) {
            $(".loader-container").css({
              'display': 'none'
            });

            $(".timeline-wrapper").css({
              'display': 'block'
            });

            // Set variables to retrieved values
            self.timelineEvents = result.data.timelineEvents;

              // Sort events according to timestamp
              self.timelineEvents.sort(function(a, b) {
                  var keyA = a.timestamp;
                  var keyB = b.timestamp;
                  if(keyA < keyB) return -1;
                  if(keyA > keyB) return 1;
                  return 0;
              });
              self.timelineEvents.reverse();

            // Convert timestamps of each event
            for (var i = 0; i < self.timelineEvents.length; i++) {
              self.timelineEvents[i].timestamp = self.timeConverter(self.timelineEvents[i].timestamp);
            }

            // Calculate score
            self.timelineEvents.forEach(function(event){
              console.log("**********");
              console.log(event);
              self.points += event.pointValue;
            });

            $("#card-score").find(".card-loader").css({
              'display': 'none'
            });

            $("#card-score").find(".card").css({
              'display': 'block'
            });

            $scope.$apply();
          }).catch(function (result) {
        console.log("Error retrieving timeline info: " + JSON.stringify(result));
      });
    };

    // Generate the values for the cards
    self.generateCards = function() {

      // Count the number of plants belonging to the user
      apigClient.plantsUserUsernameGet(params, body)
        .then(function (result) {
          self.numPlants = result.data.plants.length;

          $("#card-plants").find(".card-loader").css({
            'display': 'none'
          });

          $("#card-plants").find(".card").css({
            'display': 'block'
          });

          $scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });

      // Count the number of plant boxes
      apigClient.thingsUserUsernameGet(params, body)
        .then(function (result) {
          self.numPlantBoxes = result.data.things.length;

          console.log(self.numPlantBoxes);

          $("#card-plant-boxes").find(".card-loader").css({
            'display': 'none'
          });

          $("#card-plant-boxes").find(".card").css({
            'display': 'block'
          });
        });


    };
  }
});
