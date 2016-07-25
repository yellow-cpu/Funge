'use strict';

// Register `site` component, along with its associated controller and template
angular.
  module('site').
  component('site', {
    templateUrl: 'components/site/site.template.html',
    controller: function SiteController() {
      var self = this;

      self.logout = function () {
        console.log("xxx");
      }
    }
  }).
  service('siteService', function($localStorage) {
    var logout = function() {
      $localStorage.$reset();
      console.log("Local storage reset... ");
    };

    var plant = {};

    var setPlant = function(_plant) {
      plant = _plant;
    };

    var getPlant = function() {
      return plant;
    };

    return {
      logout: logout,
      setPlant: setPlant,
      getPlant: getPlant
    };
  });
