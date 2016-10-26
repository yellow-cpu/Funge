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
  service('refreshService', function($localStorage, $sessionStorage) {
    var needsRefresh = function (expireTime) {
      var currentTime = AWS.util.date.getDate().getTime();
      console.log("current time: " + currentTime);
      var adjustedTime = new Date(currentTime + 15 * 1000);

      if (expireTime && adjustedTime > expireTime) {
        return true;
      } else {
        return false;
      }
    };

    var refresh = function(username, password, callback) {
      console.log("calling refresh service");

      var apigClient = apigClientFactory.newClient();

      var params = {};

      var body = {
        "username": username,
        "password": password
      }

      apigClient.loginPost(params, body)
        .then(function (result) {
          console.log(JSON.stringify(result.data));
          var credentials = result.data.credentials;

          //var creds = new AWS.Credentials(credentials.accessKey, credentials.secretKey, credentials.sessionToken);
          //creds.expireTime = credentials.expiration;

          //$localStorage.creds = creds;
          $localStorage.accessKey = credentials.accessKey;
          $localStorage.secretKey = credentials.secretKey;
          $localStorage.sessionToken = credentials.sessionToken;
          $localStorage.expiration = credentials.expiration;
          $localStorage.loggedIn = true;

          callback();
        }).catch(function (result) {
          console.log("Error: " + result);
      });
    };

    return {
      refresh: refresh,
      needsRefresh: needsRefresh
    };
  }).
  service('siteService', function($localStorage, $sessionStorage) {
    var logout = function() {
      $localStorage.$reset();
      console.log("Local storage reset.");

      for (var key in $sessionStorage.client) {
        let value = $sessionStorage.client[key];
        try {
          if (value !== null && value.isConnected())
            value.disconnect();
        } catch (e) {}
      }
    };

    var plant = {};

    var setPlant = function(_plant) {
      _plant.plantAge = _plant.plantAge.substr(0, _plant.plantAge.indexOf('T'));
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
