'use strict';

// Register `plantDetail` component, along with its associated controller and template
angular.module('plantDetail').component('plantDetail', {
  templateUrl: 'components/plant-detail/plant-detail.template.html',
  controller: function PlantDetailController($scope, $localStorage, $sessionStorage, siteService, refreshService, $mdDateLocale, $mdDialog) {
    var self = this;

    $mdDateLocale.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };

    // Set up MQTT

    function SigV4Utils() { }

    SigV4Utils.sign = function (key, msg) {
      var hash = CryptoJS.HmacSHA256(msg, key);
      return hash.toString(CryptoJS.enc.Hex);
    };

    SigV4Utils.sha256 = function (msg) {
      var hash = CryptoJS.SHA256(msg);
      return hash.toString(CryptoJS.enc.Hex);
    };

    SigV4Utils.getSignatureKey = function (key, dateStamp, regionName, serviceName) {
      var kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
      var kRegion = CryptoJS.HmacSHA256(regionName, kDate);
      var kService = CryptoJS.HmacSHA256(serviceName, kRegion);
      var kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
      return kSigning;
    };

    SigV4Utils.getSignedUrl = function (protocol, host, uri, service, region, accessKey, secretKey, sessionToken) {
      var time = moment().utc();
      var dateStamp = time.format('YYYYMMDD');
      var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
      var algorithm = 'AWS4-HMAC-SHA256';
      var method = 'GET';

      var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
      var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
      canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
      canonicalQuerystring += '&X-Amz-Date=' + amzdate;
      canonicalQuerystring += '&X-Amz-SignedHeaders=host';

      var canonicalHeaders = 'host:' + host + '\n';
      var payloadHash = SigV4Utils.sha256('');
      var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;


      var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
      var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
      var signature = SigV4Utils.sign(signingKey, stringToSign);

      canonicalQuerystring += '&X-Amz-Signature=' + signature;
      if (sessionToken) {
        canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);
      }

      var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
      return requestUrl;
    };


    function onConnectionLost(responseObject) {
      // Check that disconnect was not done purposely
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        self.status = "";
        $scope.$apply();
      }
    }

    if ($sessionStorage.client == undefined) {
      $sessionStorage.client = [];
      self.status = "";
    }

    function initClient(requestUrl, mqttTopic) {
      console.log(mqttTopic);

      if ($sessionStorage.client[self.plantDetails.plantId] == undefined || $sessionStorage.client[self.plantDetails.plantId] == null ) {
        var clientId = String(Math.random()).replace('.', '');
        $sessionStorage.client[self.plantDetails.plantId] = new Paho.MQTT.Client(requestUrl, clientId);
        $sessionStorage.client[self.plantDetails.plantId].onConnectionLost = onConnectionLost;

        var connectOptions = {
          onSuccess: function () {
            console.log('connected');
            self.status = "connected";
            $scope.$apply();

            // subscribe to the topic
            $sessionStorage.client[self.plantDetails.plantId].subscribe(mqttTopic);
          },
          useSSL: true,
          timeout: 15,
          mqttVersion: 4,
          onFailure: function () {
            console.error('connect failed');
          }
        };
        $sessionStorage.client[self.plantDetails.plantId].connect(connectOptions);
      } else {
        self.status = "connected";
      }


    }

    self.publish = function (payload) {
      // publish a lifecycle event
      //var payload = '{"state": {"desired": {"red": 50, "green": 255, "blue": 100}}}';

      try {
        var message = new Paho.MQTT.Message(payload);
        message.destinationName = self.thing.mqttTopic;
        $sessionStorage.client[self.plantDetails.plantId].send(message);
        console.log('sent');
      } catch (e) {
        console.log('publishFailed', e);
      }
    };

    self.requestUrl = null;

    // Date pickers & history
    self.tempStartDate = new Date();
    self.tempEndDate = new Date();

    self.humidityStartDate = new Date();
    self.humidityEndDate = new Date();

    self.moistureStartDate = new Date();
    self.moistureEndDate = new Date();

    self.minDate = new Date();
    self.maxDate = new Date();

    self.tempHistory = {};
    self.humidityHistory = {};
    self.moistureHistory = {};

    self.getPlantHistory = function (chart, callback) {
      var apigGetPlantHistory = function () {
        console.log("getting plant history");
        var params = {};

        self.tempStartDate.setHours(2);
        self.tempStartDate.setMinutes(0);
        self.tempStartDate.setSeconds(0);
        self.tempStartDate.setMilliseconds(0);

        self.tempEndDate.setHours(2);
        self.tempEndDate.setMinutes(0);
        self.tempEndDate.setSeconds(0);
        self.tempEndDate.setMilliseconds(0);
        self.tempEndDate.setDate(self.tempEndDate.getDate() + 1);

        var startDate;
        var endDate;

        if (chart == "tempHistory") {
          startDate = self.tempStartDate.getTime();
          endDate = self.tempEndDate.getTime();
        } else if (chart == "humidityHistory") {
          startDate = self.humidityStartDate.getTime();
          endDate = self.humidityEndDate.getTime();
        } else if (chart == "moistureHistory") {
          startDate = self.moistureStartDate.getTime();
          endDate = self.moistureEndDate.getTime();
        }

        console.log(startDate);
        console.log(endDate);

        var body = {
          "plantId": self.plantDetails.plantId,
          "chartType": chart,
          "startDate": startDate,
          "endDate": endDate
        };

        console.log(body);

        self.apigClient.plantsHistoryPost(params, body)
          .then(function (result) {
            console.log(result);

            console.log(chart);

            if (chart == "tempHistory") {
              self.tempHistory.startTimes = result.data.startTimes;
              self.tempHistory.avg = result.data.averages;
              self.tempHistory.mins = result.data.mins;
              self.tempHistory.maxes = result.data.maxes;
            } else if (chart == "humidityHistory") {
              self.humidityHistory.startTimes = result.data.startTimes;
              self.humidityHistory.avg = result.data.averages;
              self.humidityHistory.mins = result.data.mins;
              self.humidityHistory.maxes = result.data.maxes;
            } else if (chart == "moistureHistory") {
              self.moistureHistory.startTimes = result.data.startTimes;
              self.moistureHistory.avg = result.data.averages;
              self.moistureHistory.mins = result.data.mins;
              self.moistureHistory.maxes = result.data.maxes;
            }

            callback();
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
      };

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigGetPlantHistory();
        });
      } else {
        apigGetPlantHistory();
      }
    };

    // Light control
    self.nmSlider = {
      value: 500,
      options: {
        floor: 400,
        ceil: 700,
        showSelectionBar: true,
        getSelectionBarColor: function(value) {
          var hex = rgbToHex(nmToRGB(value));

          $("#nmSlider > span.rz-pointer.rz-pointer-min").css({
            "background-color": hex
          });

          return hex;
        }
      }
    };

    // Fan control
    self.fanSlider = {
      value: 0,
      options: {
        floor: 0,
        ceil: 100,
        showSelectionBar: true
      }
    };

    self.pumpOn = "off";
    self.lightOn = "On";
    self.lightWhite = false;

    self.updateControl = function () {
      if (self.status == "connected") {
        var updateControl = $('#updateControl');

        updateControl.find('span').css({
          "display": "none"
        });

        updateControl.find('.update-spin').css({
          "display": "inline-block"
        });

        var rgb = nmToRGB(self.nmSlider.value);
        var fanPower = (self.fanSlider.value/100) * 255;
        var pumpOn = (self.pumpOn == "on") ? 1 : 0;
        console.log(self.pumpOn + ": " + pumpOn);

        if (self.lightOn == "Off") {
          rgb[0] = 0;
          rgb[1] = 0;
          rgb[2] = 0;
        } else if (self.lightWhite == true) {
          rgb[0] = 255;
          rgb[1] = 255;
          rgb[2] = 255;
        }

        console.log(rgb + " " + fanPower + " " + pumpOn);

        self.publish('{' +
          '"state": {' +
            '"desired": {' +
              '"red": ' + rgb[0] + ',' +
              '"green": ' + rgb[1] + ',' +
              '"blue": ' + rgb[2] + ',' +
              '"fanSpeed": ' + fanPower + ',' +
              '"pumpTime": ' + pumpOn +
          '}' +
          '}' +
        '}');
      }
    };

    var toHex = function(number) {
      var hex =  number.toString(16);
      if (hex.length < 2) {
        hex = "0" + hex;
      }

      return hex;
    };

    var rgbToHex = function(color) {
      var hexString = '#';
      for (var i = 0 ; i < 3 ; i++) {
        hexString += toHex(color[i]);
      }

      return hexString;
    };

    var nmToRGB = function (wavelength) {
      var Gamma = 0.80,
        IntensityMax = 255,
        factor, red, green, blue;
      if ((wavelength >= 380) && (wavelength<440)) {
        red = -(wavelength - 440) / (440 - 380);
        green = 0.0;
        blue = 1.0;
      } else if ((wavelength >= 440) && (wavelength<490)) {
        red = 0.0;
        green = (wavelength - 440) / (490 - 440);
        blue = 1.0;
      } else if ((wavelength >= 490) && (wavelength<510)) {
        red = 0.0;
        green = 1.0;
        blue = -(wavelength - 510) / (510 - 490);
      } else if ((wavelength >= 510) && (wavelength<580)) {
        red = (wavelength - 510) / (580 - 510);
        green = 1.0;
        blue = 0.0;
      } else if ((wavelength >= 580) && (wavelength<645)) {
        red = 1.0;
        green = -(wavelength - 645) / (645 - 580);
        blue = 0.0;
      } else if ((wavelength >= 645) && (wavelength<781)) {
        red = 1.0;
        green = 0.0;
        blue = 0.0;
      } else {
        red = 0.0;
        green = 0.0;
        blue = 0.0;
      }

      // Let the intensity fall off near the vision limits
      if((wavelength >= 380) && (wavelength<420)){
        factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
      }else if((wavelength >= 420) && (wavelength<701)){
        factor = 1.0;
      }else if((wavelength >= 701) && (wavelength<781)){
        factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
      }else{
        factor = 0.0;
      };
      if (red !== 0){
        red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
      }
      if (green !== 0){
        green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
      }
      if (blue !== 0){
        blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
      }
      return [red,green,blue];
    };

    self.chartStatus = {
      "temp": true,
      "humidity": true,
      "moisture": true,
      "light": true
    };

    self.avgMinMax = {
      "temp": {
        "num": 0,
        "avg": 0,
        "min": 0,
        "max": 0
      },
      "humidity": {
        "num": 0,
        "avg": 0,
        "min": 0,
        "max": 0
      },
      "moisture": {
        "num": 0,
        "avg": 0,
        "min": 0,
        "max": 0
      }
    };

    // Set up API calls

    self.apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    self.plantDetails = siteService.getPlant();

    var params = {
      "plantid": self.plantDetails.plantId
    };

    var body = {};

    self.getPlantThings = function() {
      var apigGetPlantThings = function () {
        self.apigClient.thingsPlantPlantidGet(params, body)
          .then(function (result) {
            console.log("Success: " + JSON.stringify(result));

            if (result.data.thingName == "undefined" && result.data.mqttTopic == "undefined") {
              console.log("No plant box associated with thing");

              self.status = "history";
              $scope.$apply();

              $('#noplantbox').css({
                "display": "block"
              });

              $('#connecting').css({
                "display": "none"
              });

              $('#mqttStatus').find('.mqtt-spin').css({
                "display": "none"
              });
            } else {
              self.thing = result.data;

              self.requestUrl = SigV4Utils.getSignedUrl(
                'wss',
                'a3afwj65bsju7b.iot.us-east-1.amazonaws.com',
                '/mqtt',
                'iotdevicegateway',
                $localStorage.region,
                $localStorage.accessKey,
                $localStorage.secretKey,
                $localStorage.sessionToken
              );

              initClient(self.requestUrl, self.thing.mqttTopic);
              $scope.$apply();
            }
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
      }

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigGetPlantThings();
        });
      } else {
        apigGetPlantThings();
      }
    }

    self.updatePlant = function () {
      if (self.plantDetails.plantName == "" || self.plantDetails.plantAge == "") {
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Empty Plant')
            .textContent('Please fill in all details for your new plant!')
            .ariaLabel('Alert Dialog Demo')
            .ok('Ok!')
        );
      } else {
        var plantUpdate = $('#plantUpdate');

        plantUpdate.find('span').css({
          "display": "none"
        });

        plantUpdate.find('.update-spin').css({
          "display": "inline-block"
        });

        var apigUpdatePlant = function () {
          var params = {};
          var body = self.plantDetails;

          self.apigClient.plantsUpdatePost(params, body)
            .then(function (result) {
              plantUpdate.find('.update-spin').css({
                "display": "none"
              });

              plantUpdate.find('svg').css({
                "display": "block"
              });

              setTimeout(function () {
                plantUpdate.find('span').css({
                  "display": "inline"
                });

                plantUpdate.find('svg').css({
                  "display": "none"
                });
              }, 3000);

              console.log("Success: " + JSON.stringify(result));
            }).catch(function (result) {
            console.log("Error: " + JSON.stringify(result));
          });
        };

        if (refreshService.needsRefresh($localStorage.expiration)) {
          refreshService.refresh($localStorage.username, $localStorage.password, function () {
            self.apigClient = apigClientFactory.newClient({
              accessKey: $localStorage.accessKey,
              secretKey: $localStorage.secretKey,
              sessionToken: $localStorage.sessionToken,
              region: $localStorage.region
            });

            apigUpdatePlant();
          });
        } else {
          apigUpdatePlant();
        }
      }
    };

    self.deletePlant = function () {
      var apigDeletePlant = function () {
        var params = {
          plantId: self.plantDetails.plantId
        };

        var body = {};

        self.apigClient.plantsDeletePlantIdGet(params, body)
          .then(function (result) {
            window.location = "/#/site/plants";
            console.log("Success: " + JSON.stringify(result));
          }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
      };

      if (refreshService.needsRefresh($localStorage.expiration)) {
        refreshService.refresh($localStorage.username, $localStorage.password, function () {
          self.apigClient = apigClientFactory.newClient({
            accessKey: $localStorage.accessKey,
            secretKey: $localStorage.secretKey,
            sessionToken: $localStorage.sessionToken,
            region: $localStorage.region
          });

          apigDeletePlant();
        });
      } else {
        apigDeletePlant();
      }
    };

    self.plants = siteService.getPlants();
    $scope.getPlantTypes = function (search) {
      if (self.plants === undefined) self.plants = [];
      $scope.plantTypes = self.plants.map(x => x.plantType).sort();

      var newTypes = $scope.plantTypes.slice();

      if (search && newTypes.indexOf(search) === -1) {
        newTypes.unshift(search);
      }

      return newTypes.filter((v, i, a) => a.indexOf(v) === i);
    };
  }
});
