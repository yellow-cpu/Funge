'use strict';

// Register `site` directive
angular.module('site').directive('site', function ($compile) {
  var linkFunction = function(scope, element, attributes) {
    $(document).ready(function() {
      $('#side-menu').metisMenu();
    });

    $('#a-plants').on('click', function() {
      alert('xxx');
    });
  };

  return {
    link: linkFunction
  };
});
