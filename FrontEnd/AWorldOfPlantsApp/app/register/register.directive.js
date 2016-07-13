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

            var valid = true;

            var errorCss = {
                'outline': 'none',
                'border-color': '#ff5139',
                'box-shadow': '0 0 10px #ff5139'
            };

            if (password != confirmPassword) {
                $('#confirmPassword').css(errorCss);
                valid = false;
            }

            var emailPattern = /\A[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\z"/i;

            if (email.match(emailPattern)) {
                $('#email').css(errorCss);
                valid = false;
            }

            if (!valid) {
                return;
            }

            scope.$ctrl.directiveToCtrl(email, username, password);
        });
    };

    return {
        link: linkFunction
    };
});
