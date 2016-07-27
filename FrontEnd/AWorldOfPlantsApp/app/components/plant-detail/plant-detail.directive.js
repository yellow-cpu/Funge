'use strict';

// Register `plantDetail` directive
angular.
module('plants').
directive('plantDetailDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('#plantUpdate').on('click', function() {
      // Do some DOM manipulation to indicate something happens
      scope.$ctrl.updatePlant();
    });

    $('#plantDelete').on('click', function() {
      // Do some DOM manipulation and redirect to indicate it has been deleted
      scope.$ctrl.deletePlant();
    });
  };

  return {
    link: linkFunction
  };
});
