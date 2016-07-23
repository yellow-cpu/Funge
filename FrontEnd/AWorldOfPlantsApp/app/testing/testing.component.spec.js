'use strict';

describe('testing', function() {

  // Load the module that contains the `testing` component before each test
  beforeEach(module('testing'));

  // Test the controller
  describe('TestingController', function() {

    it('should xxx', inject(function($componentController) {
      var ctrl = $componentController('testing');
    }));

  });

});
