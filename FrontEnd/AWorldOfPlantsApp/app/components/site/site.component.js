'use strict';

// Register `site` component, along with its associated controller and template
angular.
  module('site').
  component('site', {
    templateUrl: 'components/site/site.template.html',
    controller: function SiteController($localStorage) {
      var self = this;

      self.username = $localStorage.username;
    }
  }).
  service('siteService', function($localStorage, $sessionStorage) {
    var logout = function() {
      $localStorage.$reset();
      console.log("Local storage reset.");

      for (var key in $sessionStorage.client) {
        let value = $sessionStorage.client[key];
        value.disconnect();
      }
    };

    var plant = {};

    var setPlant = function(_plant) {
      plant = _plant;
      $localStorage.plant = _plant;
    };

    var getPlant = function() {
      return $localStorage.plant;
    };

    var setPlants = function(_plants) {
      $localStorage.plants = _plants;
    }

    var getPlants = function() {
      return $localStorage.plants;
    }

    return {
      logout: logout,
      setPlant: setPlant,
      getPlant: getPlant,
      setPlants: setPlants,
      getPlants: getPlants
    };
  });
