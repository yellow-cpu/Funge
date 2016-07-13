'use strict';

// Register `landing` component, along with its associated controller and template
angular.
  module('landing').
  component('landing', {
    templateUrl: 'landing/landing.template.html',
    controller: function LandingController() {
      var self = this;

      self.mainOptions = {
        sectionsColor: ['#36465D', '#36465D'],
        verticalCentered: false,
        navigation: true,
        navigationPosition: 'right',
        scrollingSpeed: 1000
      }
    }
  });
