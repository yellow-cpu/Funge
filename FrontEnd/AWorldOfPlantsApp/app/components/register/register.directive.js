'use strict';

// Register `register` directive
angular.module('register').directive('attemptRegister', function ($state) {
    var linkFunction = function (scope, element, attributes) {
        $('#signUp').on('click', function () {

            var email = $('#email');
            var username = $('#username');
            var password = $('#password');
            var confirmPassword = $('#confirmPassword');

            $('#error').remove();
            email.removeClass('errorCss');
            username.removeClass('errorCss');
            password.removeClass('errorCss');
            confirmPassword.removeClass('errorCss');

            var error;

            var emailPattern = /.+@.+/;

            if (!emailPattern.test(email.val())) {
                error = $("<div id='error' class=\"alert alert-danger\">" +
                    "<strong>Invalid email. eg. username@gmail.com</strong></div>");
                error.insertAfter('#confirmPassword');
                email.addClass('errorCss');
                return;
            }

            var usernamePattern = /.{3,20}/;

            if (!usernamePattern.test(username.val())) {
                error = $("<div id='error' class=\"alert alert-danger\">" +
                    "<strong>Invalid username. Must be between 3 and 20 characters" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                username.addClass('errorCss');
                return;
            }

            var passwordPattern = /.{8,32}/; //Temporary - must change

            if (!passwordPattern.test(password.val())) {
                error = $("<div id='error' class=\"alert alert-danger\">" +
                    "<strong>Invalid password. Must be greater than 8 characters" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                password.addClass('errorCss');
                return;
            }

            if (password.val() != confirmPassword.val()) {
                error = $("<div id='error' class=\"alert alert-danger\">" +
                    "<strong>Password do not match" +
                    "</strong></div>");
                error.insertAfter('#confirmPassword');
                confirmPassword.addClass('errorCss');
                return;
            }

            var apigClient = apigClientFactory.newClient();

            var params = {};

            var body = {
                "email": email.val(),
                "username": username.val(),
                "password": password.val()
            };

            $(".loader-container").css({
                'display': 'block'
            });

            $('#signUp').css({
                'display': 'none'
            });

            apigClient.usersPost(params, body)
                .then(function (result) {
                    var credentials = result.data.credentials;
                    var identityId = result.data.identityId;
                    var username = result.data.username;
                    var streak = result.data.streak;
                    console.log(credentials);

                    AWS.config.credentials = {
                        accessKey: credentials.accessKey,
                        secretKey: credentials.secretKey,
                        sessionToken: credentials.sessionToken,
                        region: 'us-east-1'
                    };

                    scope.$ctrl.saveLogin(identityId, credentials.accessKey, credentials.secretKey, credentials.sessionToken, credentials.expiration, 'us-east-1', username, password.val(), 0);

                    // Navigate to site
                    $state.go('site.profile');
                }).catch(function (result) {
                console.log("Error: " + JSON.stringify(result));
                error = $("<div id='error' class=\"alert alert-danger\">" +
                    "<strong>Username or email already in use. Please try again</strong></div>");
                error.insertAfter('#confirmPassword');

                $(".loader-container").css({
                    'display': 'none'
                });

                $('#signUp').css({
                    'display': 'block'
                });
            });
        });
    };

    return {
        link: linkFunction
    };
});
