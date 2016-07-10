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
        "plantType": "Flower",
        "plantName": "Timmy",
        "plantAge": 3
      };

      self.getPlants = function getPlants() {
        var params = {
          "action": "cf.funge.aworldofplants.action.ListPlantsAction"
        };

        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.plantsGet(params, {})
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };

      self.getPlantId = function getPlantId(plantId) {
        var params = {
          "action": "cf.funge.aworldofplants.action.action.GetPlantAction",
          "plantId": plantId
        };

        var body = {};

        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.plantsPlantIdGet(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
            self.thePlant = JSON.stringify(result.data.petName);
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };

      self.createPlant = function createPlant() {
        var params = {
          "action": "cf.funge.aworldofplants.action.CreatePlantAction"
        };

        var body = {
          "plantType": "Flower",
          "plantName": "Bob",
          "plantAge": 9001
        };

        console.log(AWS.config.credentials);
        var apigClient = apigClientFactory.newClient(AWS.config.credentials);

        apigClient.plantsPost(params, body)
          .then(function(result){
            console.log("Success: " + JSON.stringify(result.data));
          }).catch( function(result){
            console.log("Error: " + JSON.stringify(result));
          });
      };
    }
  });
