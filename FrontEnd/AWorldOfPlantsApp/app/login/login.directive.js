'use strict';

// Register `login` directive
angular.
module('login').
directive('switchToRegister', function($compile) {
    var linkFunction = function(scope, element, attributes) {
        $('#switchToRegister').on('click', function() {
            $('#my-tab-content').html($compile('<register></register>')(scope));
        });
    };

    return {
        link: linkFunction
    };
});

