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
                template: '<login></login>',
                needAdmin: 'false'
            })
            // Nested register page in landing page
            .state('landing.register', {
                url: '/register',
                template: '<register></register>',
                needAdmin: 'false'
            })
        // Site
        .state('site', {
            url: '/site',
            template: '<site></site>'
        })
            // Nested profile page in site
            .state('site.profile', {
                url: '/profile',
                template: '<profile></profile>',
                needAdmin: 'true'
            })
            // Nested plants page in site
            .state('site.plants', {
                url: '/plants',
                template: '<plants></plants>',
                needAdmin: 'true'
            })
            // Nested things page in site
            .state('site.things', {
                url: '/things',
                template: '<things></things>',
                needAdmin: 'true'
            })
})
    .controller('routingCtrl', ['$scope', function ($scope) { }])
    // TODO: Prevent unauthorised access
    .run(['$rootScope', '$state', '$stateParams', '$localStorage',
        function ($rootScope, $state, $stateParams, $localStorage) {
            $rootScope.$on('$stateChangeStart', function(e, to) {
                // If user is logged in, prevent them from going out of the site by pressing back
                if ($localStorage && $localStorage.loggedIn && to.needAdmin && to.needAdmin === 'false') {
                    e.preventDefault();
                    $state.go('site.profile');
                }
                // If user is not logged in, prevent unauthorised access
                else if ((!$localStorage || !$localStorage.loggedIn) && to.needAdmin && to.needAdmin === 'true') {
                    e.preventDefault();
                    $state.go('landing.login');
                }
                else {
                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams;
                }

            });

        }
    ]);

