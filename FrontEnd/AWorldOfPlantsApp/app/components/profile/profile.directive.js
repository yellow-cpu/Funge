'use strict';

var count = 1;

// Register `profile` directive
angular.
module('profile').
directive('viewTimelineDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
      // Get timeline events of current user from component
      scope.$ctrl.getTimelineEvents();
  };

  return {
    link: linkFunction
  };
}).
// Gets called for every event
directive('populateTimelineDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {

    // Alternate between left and right display of events
    count++;
    if (count % 2 == 0) {
      $('li.event').addClass('timeline-inverted');
    }
    if (count == 100) count = 1;
  };

  return {
    link: linkFunction
  };
});
