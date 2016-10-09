'use strict';

// Register `things` directive
angular.
module('things').
directive('thingsDirective', function ($compile, $localStorage) {
  var linkFunction = function (scope, element, attributes) {
    $(document).ready(function () {
      scope.$ctrl.getThings();
    });
  };

  return {
    link: linkFunction
  };
}).
directive('deleteThingDirective', function () {
  var linkFunction = function (scope, element, attributes) {
    $('#deleteThingModal').on('hidden.bs.modal', function () {
      $('#thingError').css({
        "display": "none"
      });
    });

    $('#deleteThing').on('click', function () {
      var deleteThingName = $('#deleteThingName').val();
      var username = scope.$ctrl.selectedThing.username;
      var thingName = scope.$ctrl.selectedThing.thingName;

      if (deleteThingName == thingName) {
        $('#deleteThingModal').modal('hide');
        scope.$ctrl.removeThing(thingName, username);
      } else {
        $('#thingError').css({
          "display": "inline-block"
        });
      }
    });
  };

  return {
    link: linkFunction
  }
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
