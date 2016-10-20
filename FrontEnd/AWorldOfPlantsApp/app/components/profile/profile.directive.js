'use strict';

// Register `profile` directive
angular.
module('profile').
directive('viewTimelineDirective', function ($compile, $localStorage, refreshService) {
  var linkFunction = function (scope, element, attributes) {
      // Get timeline events of current user from component
      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          scope.$ctrl.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          scope.$ctrl.getTimelineEvents();
          scope.$ctrl.generateCards();
          scope.$ctrl.getUserDetails();
        });
      } else {
        scope.$ctrl.getTimelineEvents();
        scope.$ctrl.generateCards();
        scope.$ctrl.getUserDetails();
      }
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
directive('populateCardsDirective', function($compile, $localStorage, refreshService) {
  var linkFunction = function (scope, element, attributes) {
  };

  return {
    link: linkFunction
  };
});