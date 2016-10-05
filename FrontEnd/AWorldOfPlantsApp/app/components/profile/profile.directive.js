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
      if (index % 2 == 0)
        $(this).addClass('timeline-inverted');
    });
  };

  return {
    link: linkFunction
  };
}).
// Populate data for the cards
directive('populateCardsDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    scope.$ctrl.generateCards();
  };

  return {
    link: linkFunction
  };
});