'use strict';

// Register `site` directive
angular.module('site').directive('site', function ($compile) {
  var linkFunction = function(scope, element, attributes) {
    $(document).ready(function() {
      $('#side-menu').metisMenu();
    });

    $('#a-dashboard').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $('#page-wrapper').html($compile('<dashboard></dashboard>')(scope));
    });

    $('#a-plants').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $('#page-wrapper').html($compile('<plants></plants>')(scope));
    });
  };

  return {
    link: linkFunction
  };
});
