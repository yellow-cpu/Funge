'use strict';

// Register `plants` directive
angular.
module('plants').
directive('viewDetailsDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $(document).ready(function() {
      scope.$ctrl.getPlants();
    });

    scope.$ctrl.viewDetails = function() {
      $('#page-wrapper').html($compile('<plant-detail></plant-detail>')(scope));
    };
  };

  return {
    link: linkFunction
  };
}).
directive('createPlantDirective', function() {
  var linkFunction = function (scope, element, attributes) {
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
