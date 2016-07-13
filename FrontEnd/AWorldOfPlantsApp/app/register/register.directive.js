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
            var email = $('#email').val();
            var username = $('#username').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();

            if (password != confirmPassword) {
                $('#password').css({
                    "border": "red solid 1px"
                });

                return;
            }

            scope.$ctrl.directiveToCtrl(email, username, password);
        });
    };

    return {
        link: linkFunction
    };
});
