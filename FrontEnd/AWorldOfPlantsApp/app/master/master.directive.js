'use strict';

// Register `master` component, along with its associated controller and template
angular.
  module('master').
  directive('wrapper', function() {
    var linkFunction = function(scope, element, attributes) {
      var wrapper = angular.element(document.querySelector('#wrapper'));

      var resizeFunction = function() {
        $(wrapper).css({
          'width': $(window).width(),
          'height': $(window).height()
        });
      }

      $(document).ready(resizeFunction);
      $(window).resize(resizeFunction);
    };

    return {
      link: linkFunction
    };
  });
