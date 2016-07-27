'use strict';

// Register `login` component, along with its associated controller and template
angular.module('login').component('login', {
    templateUrl: 'components/login/login.template.html',
    controller: function LoginController($localStorage) {
        var self = this;

        self.user = {
            "username": "",
            "password": ""
        };

        self.saveLogin = function (identityId, accessKey, secretKey, sessionToken, region, username) {
            $localStorage.identityId = identityId;
            $localStorage.accessKey = accessKey;
            $localStorage.secretKey = secretKey;
            $localStorage.sessionToken = sessionToken;
            $localStorage.region = region;
            $localStorage.username = username;
            $localStorage.loggedIn = true;
        };
    }
});
