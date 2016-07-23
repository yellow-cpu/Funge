'use strict';

// Register `login` component, along with its associated controller and template
angular.module('login').component('login', {
    templateUrl: 'login/login.template.html',
    controller: function LoginController() {
        var self = this;

        self.user = {
            "username": "",
            "password": ""
        };

        self.logoutUser = function logoutUser(username, password) {

        };
    }
});
