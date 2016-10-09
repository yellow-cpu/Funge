'use strict';

// Register `plants` directive
angular.
module('plants').
directive('viewPlantsDetailsDirective', function ($state) {
  var linkFunction = function (scope, element, attributes) {
    $(document).ready(function() {
      scope.$ctrl.getPlants();
    });

    // scope.$ctrl.viewDetails = function() {
    //   $state.go('site.plants.plant');
    // };
  };

  return {
    link: linkFunction
  };
}).
directive('createPlantDirective', function() {
  var linkFunction = function (scope, element, attributes) {
    $('#createPlantModal').on('hidden.bs.modal', function () {
      $('#plantName').val('');
    });

    $('#plantColour > ul').on('click', function () {
      $('.modal-header').css("background-color", scope.$ctrl.selectedColour);
      $('.modal-header').css("border-color", scope.$ctrl.selectedColour);

      $('#createPlant').css("background-color", scope.$ctrl.selectedColour);
      $('#createPlant').css("border-color", scope.$ctrl.selectedColour);

      scope.$ctrl.newPlant.colour = scope.$ctrl.selectedColour;
    });

    $('#createPlant').on('click', function() {
      scope.$ctrl.createPlant();
      $('#plantType').val('');
      $('#plantName').val('');
    });
  };

  return {
    link: linkFunction
  };
});
