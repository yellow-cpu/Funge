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
      otherwise('/landing');
    }
  ]);
