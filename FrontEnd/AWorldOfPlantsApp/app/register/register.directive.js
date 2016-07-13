'use strict';

// Register `register` component, along with its associated controller and template
angular.
module('register').
directive('switchToLogin', function($compile) {
    var linkFunction = function(scope, element, attributes) {
        $('#switchToLogin').on('click', function() {
            $('#my-tab-content').html($compile('<login></login>')(scope));
        });
    };

    return {
        link: linkFunction
    };
});
