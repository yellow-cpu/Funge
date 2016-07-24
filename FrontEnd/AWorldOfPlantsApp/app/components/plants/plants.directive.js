'use strict';

// Register `plants` directive
angular.
module('plants').
directive('plantsDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('.view-details').on('click', function () {
      $('#page-wrapper').html($compile('<plant-detail></plant-detail>')(scope));
      console.log($(this).data('plantId'));
    });
  };

  return {
    link: linkFunction
  };
});
