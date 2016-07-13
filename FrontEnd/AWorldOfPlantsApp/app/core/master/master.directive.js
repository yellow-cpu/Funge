'use strict';

// Register `master` directive
angular.
  module('master').
  directive('wrapper', function() {
    var linkFunction = function(scope, element, attributes) {
      var wrapper = $("#wrapper");

      var resizeFunction = function() {
        $(wrapper).css({
          'width': $(window).width(),
          'height': $(window).height()
        });
      };

      $(document).ready(resizeFunction);
      $(window).resize(resizeFunction);
    };

    return {
      link: linkFunction
    };
  });
