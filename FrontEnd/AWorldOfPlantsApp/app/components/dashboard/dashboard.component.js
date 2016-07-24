'use strict';

// Register `dashboard` component, along with its associated controller and template
angular.module('dashboard').component('dashboard', {
    templateUrl: 'components/dashboard/dashboard.template.html',
    controller: function DashboardController() {
        var self = this;
    }
});
