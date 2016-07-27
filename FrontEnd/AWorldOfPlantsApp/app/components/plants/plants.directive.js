'use strict';

// Register `plants` directive
angular.
module('plants').
directive('plantsDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
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
    scope.$ctrl.viewDetails = function() {
      $('#page-wrapper').html($compile('<plant-detail></plant-detail>')(scope));
    };

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
