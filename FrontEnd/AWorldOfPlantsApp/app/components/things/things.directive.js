'use strict';

// Register `things` directive
angular.
module('things').
directive('thingsDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
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
