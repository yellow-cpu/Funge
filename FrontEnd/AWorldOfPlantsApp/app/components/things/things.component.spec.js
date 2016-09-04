'use strict';

describe('things', function() {

  // Load the module that contains the `things` component before each test
  beforeEach(module('things'));

  // Test the controller
  describe('ThingsController', function() {

    it('should xxx', inject(function($componentController) {
      var ctrl = $componentController('things');
    }));

  });

});
