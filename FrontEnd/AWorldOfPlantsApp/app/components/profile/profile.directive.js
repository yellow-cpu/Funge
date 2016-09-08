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
    $('li.event').each(function(index) {
      console.log(index);
      if (index % 2 == 0)
        $(this).addClass('timeline-inverted');
    });
  };

  return {
    link: linkFunction
  };
});
