angular.
  module('aWorldOfPlantsApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
      when ('/site', {
        template: '<site></site>'
      }).
      when ('/landing', {
        template: '<landing></landing>'
      }).
      when ('/testing', {
        template: '<testing></testing>'
      }).
      otherwise('/landing');
    }
  ]);
