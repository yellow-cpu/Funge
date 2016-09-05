'use strict';

// Register `plantDetail` directive
angular.
module('plants').
directive('plantDetailDirective', function ($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('#plantUpdate').on('click', function() {
      // Do some DOM manipulation to indicate something happens
      scope.$ctrl.updatePlant();
    });

    $('#plantDelete').on('click', function() {
      // Do some DOM manipulation and redirect to indicate it has been deleted
      scope.$ctrl.deletePlant();
    });
  };

  return {
    link: linkFunction
  };
}).
directive('statusDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    scope.$watch(attributes.ngModel, function (value) {
      var val = value;
      if (val == "connected") {
        var mqttStatus = $('#mqttStatus');
        mqttStatus.removeClass('alert-danger');
        mqttStatus.addClass('alert-success');
        mqttStatus.html('Successfully connected to MQTT client');
      }
    });
  };

  return {
    link: linkFunction
  };
});
