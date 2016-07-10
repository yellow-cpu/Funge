'use strict';

// Register `createPlant` component, along with its associated controller and template
angular.
  module('createPlant').
  component('createPlant', {
    templateUrl: 'create-plant/create-plant.template.html',
    controller: function CreatePlantController() {
      var self = this;

      self.plantId = "xxxx:xxxx";
      self.thePlant = "xxx";

      self.plant = {
        "petType": "Dog",
        "petName": "Bob",
        "petAge": 5
      };

      self.getPlants = function getPlants() {
        var params = {
          "action": "com.amazonaws.apigatewaydemo.action.ListPetsDemoAction"
        };

        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.petsGet(params, {})
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };

      self.getPlantId = function getPlantId(plantId) {
        var params = {
          "action": "com.amazonaws.apigatewaydemo.action.GetPetDemoAction",
          "petId": plantId
        };

        var body = {};

        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.petsPetIdGet(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
            self.thePlant = JSON.stringify(result.data.petName);
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };

      self.createPlant = function createPlant() {
        var params = {
          "action": "com.amazonaws.apigatewaydemo.action.CreatePetDemoAction"
        };

        var body = {
          "petId": "asdasdasd",
          "petType": "Hamster",
          "petName": "Toby",
          "petAge": 9001
        };

        console.log(AWS.config.credentials);
        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.petsPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };
    }
  });
