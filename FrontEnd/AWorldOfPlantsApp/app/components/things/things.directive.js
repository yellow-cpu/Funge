'use strict';

// Register `things` directive
angular.
module('things').
directive('thingsDirective', function ($compile, $localStorage) {
  var linkFunction = function (scope, element, attributes) {
    $('#newThing').on('click', function () {
      var params = {
        "username": $localStorage.username
      };

      var apigClient = apigClientFactory.newClient({
        accessKey: $localStorage.accessKey,
        secretKey: $localStorage.secretKey,
        sessionToken: $localStorage.sessionToken,
        region: $localStorage.region
      });

      var body = {};

      apigClient.plantsUserUsernameGet(params, body)
        .then(function (result) {
          var plants = result.data.plants;

          scope.$ctrl.plantIdList = [];

          for (var i = 0; i < plants.length; ++i) {
            scope.$ctrl.plantIdList.push(plants[i].plantId);
          }

          scope.$apply();
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    })
  };

  return {
    link: linkFunction
  };
}).
directive('createThingDirective', function() {
  var linkFunction = function (scope, element, attributes) {
    $('#createThing').on('click', function() {
      scope.$ctrl.createThing();
      $('#thingName').val('');
      $('#plantId').val('');
    });
  };

  return {
    link: linkFunction
  };
});
