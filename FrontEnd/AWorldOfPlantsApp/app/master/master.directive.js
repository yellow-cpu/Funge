'use strict';

// Register `master` component, along with its associated controller and template
angular.
  module('master').
  directive('xyz', function() {
    var linkFunction = function(scope, element, attributes) {
      var wrapper = angular.element(document.querySelector('#wrapper'));

      $(wrapper).css({
        'background-color': 'blue'
      });
    };

    return {
      link: linkFunction
    };
  });
