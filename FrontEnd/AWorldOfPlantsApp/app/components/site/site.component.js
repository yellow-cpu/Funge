'use strict';

// Register `site` component, along with its associated controller and template
angular.
  module('site').
  component('site', {
    templateUrl: 'components/site/site.template.html',
    controller: function SiteController() {
      var self = this;
    }
  }).
  service('siteService', function() {
    var plant = {};

    var setPlant = function(_plant) {
      plant = _plant;
    }

    var getPlant = function() {
      return plant;
    }

    return {
      setPlant: setPlant,
      getPlant: getPlant
    };
  });
