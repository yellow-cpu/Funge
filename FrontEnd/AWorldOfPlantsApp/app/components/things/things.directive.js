'use strict';

// Register `things` directive
angular.
module('things').
directive('thingsDirective', function ($compile, $localStorage) {
  var linkFunction = function (scope, element, attributes) {
    $(document).ready(function () {
      scope.$ctrl.getThings();
    });

    $('.thingDelete').on('click', function () {
      alert('asd');
    });
  };

  return {
    link: linkFunction
  };
}).
directive('createThingDirective', function() {
  var linkFunction = function (scope, element, attributes) {
    $('#thingColour > ul').on('click', function () {
      $('.modal-header').css("background-color", scope.$ctrl.selectedColour);
      $('.modal-header').css("border-color", scope.$ctrl.selectedColour);

      $('#createThing').css("background-color", scope.$ctrl.selectedColour);
      $('#createThing').css("border-color", scope.$ctrl.selectedColour);

      scope.$ctrl.newThing.colour = scope.$ctrl.selectedColour;
    });

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
