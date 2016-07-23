'use strict';

// Register `register` directive
angular.
module('register').
directive('switchToLogin', function($compile) {
    var linkFunction = function(scope, element, attributes) {
        $('#switchToLogin').on('click', function() {
            $('register').animate({
                opacity: 0,
                height: "toggle"
            }, 500, function () {
                $('#my-tab-content').html($compile('<login></login>')(scope));

            });
        });

        $('#signUp').on('click', function () {

            var email = $('#email');
            var username = $('#username');
            var password = $('#password');
            var confirmPassword = $('#confirmPassword');

            $('.error').remove();
            email.removeClass('errorCss');
            username.removeClass('errorCss');
            password.removeClass('errorCss');
            confirmPassword.removeClass('errorCss');

            var error;

            var emailPattern = /.+@.+/;

            if (!emailPattern.test(email.val())) {
                error = $("<div class=\"alert alert-danger error\">" +
                    "<strong>Invalid email. eg. username@gmail.com</strong></div>");
                error.insertAfter('#confirmPassword');
                email.addClass('errorCss');
                return;
            }

            var usernamePattern = /.{3,20}/;

            if (!usernamePattern.test(username.val())) {
                error = $("<div class=\"alert alert-danger error\">" +
                    "<strong>Invalid username. Must be between 3 and 20 characters" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                username.addClass('errorCss');
                return;
            }

            var passwordPattern = /.{8,32}/; //Temporary - must change

            if (!passwordPattern.test(password.val())) {
                error = $("<div class=\"alert alert-danger error\">" +
                    "<strong>Invalid password. Must be greater than 8 characters" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                password.addClass('errorCss');
                return;
            }

            if (password.val() != confirmPassword.val()) {
                error = $("<div class=\"alert alert-danger error\">" +
                    "<strong>Password do not match" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                confirmPassword.addClass('errorCss');
                return;
            }

            scope.$ctrl.registerUser(email.val(),username.val(), password.val());
        });
    };

    return {
        link: linkFunction
    };
});
