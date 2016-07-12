angular.
    module('aWorldOfPlantsApp').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
            when('/create-plant', {
                template: '<create-plant></create-plant>'
            }).
            when('/landing', {
                template: '<landing></landing>'
            }).
            otherwise('/landing');
        }
    ]);
