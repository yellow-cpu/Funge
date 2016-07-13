'use strict';

// Register `site` component, along with its associated controller and template
angular.
  module('site').
  component('site', {
    templateUrl: 'site/site.template.html',
    controller: function SiteController() {
      var self = this;
    }
  });
