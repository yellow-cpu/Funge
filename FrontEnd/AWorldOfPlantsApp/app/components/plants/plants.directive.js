'use strict';

// Register `plants` directive
angular.
module('plants').
directive('plantsDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    scope.$ctrl.viewDetails = function() {
      $('#page-wrapper').html($compile('<plant-detail></plant-detail>')(scope));
    }
  };

  return {
    link: linkFunction
  };
});
