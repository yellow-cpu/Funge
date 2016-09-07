'use strict';

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

    // Alternate  randomly between left and right display of events
    var rand = Math.floor((Math.random() * 2) + 1);
    if (rand % 2 == 0) {
      $('li.event').addClass('timeline-inverted');
    }
  };

  return {
    link: linkFunction
  };
});
