'use strict';

// Register `site` directive
angular.module('site').directive('site', function ($state, siteService) {
  var linkFunction = function(scope, element, attributes) {
    $(document).ready(function() {
      $('#side-menu').metisMenu();
    });
  };

  return {
    link: linkFunction
  };
});
