'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
    templateUrl: 'plants/plants.template.html',
    controller: function PlantsController() {
        var self = this;
    }
});
