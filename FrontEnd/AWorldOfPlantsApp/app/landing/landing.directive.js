'use strict';

// Register `landing` component, along with its associated controller and template
angular.
  module('landing').
  directive('fullpage', function() {
    var linkFunction = function(scope, element, attributes) {
      $(document).ready(function() {
	      $('#fullpage').fullpage({
	        anchors: ['firstPage', 'secondPage', '3rdPage'],
	        sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C'],
	        navigation: true,
	        navigationPosition: 'right',
	        navigationTooltips: ['First page', 'Second page', 'Third and last page']
	      });
	    });
    };

    return {
      link: linkFunction
    };
  });
