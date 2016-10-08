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
    self.streak         = 0;

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

    /*$(".loader-container").css({
        'display': 'block'
    });

    $(".card-loader").css({
      'display': 'block'
    });

    $(".card").css({
      'display': 'none'
    });*/

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

            var today   = new Date(Date.now());
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var day   = 24 * 60 * 60 * 1000;

            // For each event...
            for (var i = 0; i < self.timelineEvents.length; i++) {
              var eventDate = new Date(self.timelineEvents[i].timestamp * 1000);
              // Convert timestamps of each event
              self.timelineEvents[i].timestamp = self.timeConverter(self.timelineEvents[i].timestamp);

              var event = self.timelineEvents[i];

              // Add score for each event to total points
              self.points += event.pointValue;

              // Increase streak and display if a streak is found
              if( event.category == "streak" &&
                  self.streak == 0 &&
                  today - eventDate <= day &&
                  today.getDay() != eventDate.getDay())
                {
                  var eventStreak = event.message.slice(13, event.message.indexOf(' ', 13));
                  self.streak = eventStreak + 1;
                  var params = {};
                  var body = {
                    username: $localStorage.username,
                    streak: self.streak,
                    timestamp: Date.now() / 1000
                  };

                  apigClient.timelineStreakOptions(params, body)
                    .then(function (result) {
                      console.log("Success: " + JSON.stringify(result.data));

                      $("#card-streak").find(".spinner").css({
                        'display': 'none'
                      });

                      $("#card-streak").find(".value").css({
                        'display': 'block'
                      });
                    }).catch(function (result) {
                    console.log("Error: " + JSON.stringify(result));
                });
              }
            }

            if(self.streak == 0)
            {
              self.streak = 1;
              var params = {};
              var body = {
                username: $localStorage.username,
                streak: self.streak,
                timestamp: Date.now() / 1000
              };

              apigClient.timelineStreakOptions(params, body)
                .then(function (result) {
                  console.log("Success: " + JSON.stringify(result.data));

                  $("#card-streak").find(".spinner").css({
                    'display': 'none'
                  });

                  $("#card-streak").find(".value").css({
                    'display': 'block'
                  });
                }).catch(function (result) {
                console.log("Error: " + JSON.stringify(result));
              });
            }


            $("#card-score").find(".spinner").css({
              'display': 'none'
            });

            $("#card-score").find(".value").css({
              'display': 'block'
            });

            $scope.$apply();
          }).catch(function (result) {
        console.log("Error retrieving timeline info: " + JSON.stringify(result));
      });
    };

    // Change numPlantBoxes
    self.updateNumPlantBoxes = function (num){
      self.numPlantBoxes = num;

      console.log(self.numPlantBoxes);

      $("#card-plant-boxes").find("div.spinner").css({
        'display': 'none'
      });

      $("#card-plant-boxes").find(".value").css({
        'display': 'block'
      });

      $scope.$apply();
    };

    // Generate the values for the cards
    self.generateCards = function() {
      // Count the number of plants belonging to the user
      apigClient.plantsUserUsernameGet(params, body)
        .then(function (result) {
          self.numPlants = result.data.plants.length;

          $("#card-plants").find("div.spinner").css({
            'display': 'none'
          });

          $("#card-plants").find(".value").css({
            'display': 'block'
          });

          $scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });

      // Count the number of plant boxes
      apigClient.thingsUserUsernameGet(params, body)
        .then(function (result) {
          self.updateNumPlantBoxes(result.data.things.length);
        });
    };
  }
});
