// Configure routing for the app
angular.
  module('aWorldOfPlantsApp').
    config(function($stateProvider, $urlRouterProvider) {

    // Default location
    $urlRouterProvider.otherwise('/landing/login');

    $stateProvider

    // Landing page
        .state('landing', {
            url: '/landing',
            template: '<landing></landing>'
        })

        // Nested login page in landing page
        .state('landing.login', {
            url: '/login',
            template: '<login></login>'
        })

        // Nested register page in landing page
        .state('landing.register', {
            url: '/register',
            template: '<register></register>'
        });
});