angular.
    module('aWorldOfPlantsApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
            when('/login', {
                template: '<login></login>'
            }).
            when('/register', {
                template: '<register></register>'
            }).
            when('/create-plant', {
                template: '<create-plant></create-plant>'
            }).
            otherwise('/login');
        }
    ]);
