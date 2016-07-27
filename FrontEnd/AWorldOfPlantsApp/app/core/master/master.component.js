'use strict';

// Register `master` component, along with its associated controller and template
angular.
  module('master').
  component('master', {
    templateUrl: 'core/master/master.template.html',
    controller: function MasterController() {
      /* jQuery animations turned off temporarily */
      $.fx.off = true;
      var self = this;
    }
  });
