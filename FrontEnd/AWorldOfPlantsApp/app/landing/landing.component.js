'use strict';

// Register `landing` component, along with its associated controller and template
angular.
  module('landing').
  component('landing', {
    templateUrl: 'landing/landing.template.html',
    controller: function LandingController() {
      var self = this;
    }
  });
