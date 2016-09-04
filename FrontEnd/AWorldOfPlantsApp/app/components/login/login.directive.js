'use strict';

// Register `login` directive
angular.module('login').directive('switchToRegister', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $("#password").keyup(function(event){
      if(event.keyCode == 13){
        $("#loginBtn").click();
      }
    });

    $('#loginBtn').on('click', function () {

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

      // scope.$ctrl.loginUser(usernameCheck, passwordCheck);

      // Logging user in
      console.log("Attempting to log user in...");

      var apigClient = apigClientFactory.newClient();

      var params = {};

      var body = {
        "username": usernameCheck,
        "password": passwordCheck
      };

      $(".loader-container").css({
        'display': 'block'
      });

      $('#loginBtn').css({
        'display': 'none'
      });

      apigClient.loginPost(params, body)
        .then(function (result) {
          console.log(JSON.stringify(result.data));

          var credentials = result.data.credentials;
          var identityId = result.data.identityId;
          var username = result.data.username;
          console.log(credentials);

          AWS.config.credentials = {
            accessKey: credentials.accessKey,
            secretKey: credentials.secretKey,
            sessionToken: credentials.sessionToken,
            region: 'us-east-1'
          };

          scope.$ctrl.saveLogin(identityId, credentials.accessKey, credentials.secretKey, credentials.sessionToken, 'us-east-1', username);

          window.location.replace("#!/site");
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
        error = $("<div id='error' class=\"alert alert-danger\">" +
          "<strong>Could not log you in. Please re-enter your credentials</strong></div>");
        error.insertAfter('#password');

        $(".loader-container").css({
          'display': 'none'
        });

        $('#loginBtn').css({
          'display': 'block'
        });
      });

    });

    $('#switchToRegister').on('click', function () {
      $('login').animate({
        height: 'toggle',
        opacity: 0
      }, 500, function () {
        $('#my-tab-content').html($compile('<register></register>')(scope));
      });

    });
  };

  return {
    link: linkFunction
  };
});
