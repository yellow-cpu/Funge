'use strict';

// Register `login` directive
angular.
module('login').
directive('switchToRegister', function($compile) {
    var linkFunction = function(scope, element, attributes) {
        $('#loginBtn').on('click', function() {

            $('#error').remove();

            var usernameCheck = $('#username').val();
            var passwordCheck = $('#password').val();

            var error = $("<div id='error' class=\"alert alert-danger\">" +
                "<strong>Please enter your username and password</strong></div>");

            var errorCss = {
                'outline': 'none',
                'border-color': '#ff5139',
                'box-shadow': '0 0 10px #ff5139'
            };

            if (usernameCheck.length == 0 || passwordCheck.length == 0) {
                $('#username').css(errorCss);
                $('#password').css(errorCss);
                error.insertAfter('#password');
                return;
            }

            scope.$ctrl.loginUser(usernameCheck, passwordCheck);
        });

        $('#switchToRegister').on('click', function() {
            $('login').animate({
               height: 'toggle',
                opacity: 0
            }, 500, function() {
                $('#my-tab-content').html($compile('<register></register>')(scope));
            });

        });
    };

    return {
        link: linkFunction
    };
});
