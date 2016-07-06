'use strict';

// Register `createPlant` component, along with its associated controller and template
angular.
  module('createPlant').
  component('createPlant', {
    templateUrl: 'create-plant/create-plant.template.html',
    controller: function CreatePlantController() {
      var self = this;

      self.plant = {
        "petId": "1",
        "petType": "Dog",
        "petName": "Bob",
        "petAge": 5
      };

      self.createPlant = function createPlant() {
        var apigClient = apigClientFactory.newClient();

        var params = {
          "action": "com.amazonaws.apigatewaydemo.action.CreatePetDemoAction"
        };

        var body = {
          "petId": "1",
          "petType": "Dog",
          "petName": "Bob",
          "petAge": 5
        };

        apigClient.petsPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };
    }
  });
