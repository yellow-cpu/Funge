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

            var emailPattern = /.+@.+/;

            if (!emailPattern.test(email)) {
                console.log("Incorrect email pattern");
                $('#email').css(errorCss);
                valid = false;
            }

            var usernamePattern = /.{3,20}/;

            if (!usernamePattern.test(username)) {
                console.log("Incorrect username pattern (must be between 3 - 20 characters)");
                $('#username').css(errorCss);
                valid = false;
            }

            var passwordPattern = /.{8,10}/; //Temporary - must change

            if (!passwordPattern.test(password)) {
                console.log("Password is not long enough");
                $('#password').css(errorCss);
                valid = false;
            }

            if (password != confirmPassword) {
                console.log("Passwords do not match");
                $('#confirmPassword').css(errorCss);
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
