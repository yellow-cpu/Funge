'use strict';

// Register `register` directive
angular.
module('register').
directive('switchToLogin', function($compile) {
    var linkFunction = function(scope, element, attributes) {
        $('#switchToLogin').on('click', function() {
            $('#my-tab-content').html($compile('<login></login>')(scope));
        });

        $('#signUp').on('click', function () {
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();

            if (password != confirmPassword) {
                alert("Passwords do not match");
                $('#password').css({
                    "border": "red solid 3px"
                });
            }
        });
    };

    return {
        link: linkFunction
    };
});
