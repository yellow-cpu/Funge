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
})
    .controller('landingCtrl', ['$scope', function ($scope) { }])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
