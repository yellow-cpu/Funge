'use strict';

// Register `site` directive
angular.module('site').directive('site', function ($compile, siteService) {
  var linkFunction = function(scope, element, attributes) {
    $(document).ready(function() {
      $('#side-menu').metisMenu();
    });

    $('#a-dashboard').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $('#page-wrapper').html($compile('<profile></profile>')(scope));
    });

    $('#a-plants').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $('#page-wrapper').html($compile('<plants></plants>')(scope));
    });

    $('#a-things').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $('#page-wrapper').html($compile('<things></things>')(scope));
    });

    $('#logout').on('click', function () {
      siteService.logout();
    });
  };

  return {
    link: linkFunction
  };
});
