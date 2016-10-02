'use strict';

// Register `site` directive
angular.module('site').directive('site', function ($state, siteService) {
  var linkFunction = function(scope, element, attributes) {
    $(document).ready(function() {
      $('#side-menu').metisMenu();
    });

    $('#a-dashboard').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $state.go('site.profile');
    });

    $('#a-plants').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $state.go('site.plants');
    });

    $('#a-things').on('click', function() {
      $('#side-menu > li > a').removeClass('active');
      $(this).addClass('active');
      $state.go('site.things');
    });

    $('#logout').on('click', function () {
      siteService.logout();
      $state.go('landing.login');
    });
  };

  return {
    link: linkFunction
  };
});
