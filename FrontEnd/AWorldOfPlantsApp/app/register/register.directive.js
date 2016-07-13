'use strict';

// Register `register` directive
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
