'use strict';

// Register `plantDetail` component, along with its associated controller and template
angular.module('plantDetail').component('plantDetail', {
  templateUrl: 'components/plant-detail/plant-detail.template.html',
  controller: function PlantDetailController($scope, $localStorage, siteService) {
    var self = this;

    // Set up MQTT

    function SigV4Utils() {}

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

    SigV4Utils.getSignedUrl = function(protocol, host, uri, service, region, accessKey, secretKey, sessionToken) {
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

    self.client = null;

    function initClient(requestUrl) {
      var clientId = String(Math.random()).replace('.', '');
      self.client = new Paho.MQTT.Client(requestUrl, clientId);
      var topic = '$aws/things/greenThing/shadow/update';


      var connectOptions = {
        onSuccess: function () {
          console.log('connected');

          // subscribe to the topic
          self.client.subscribe('$aws/things/greenThing/shadow/update');

          // publish a lifecycle event
          var payload = '{"state": {"desired": {"asd": "asd"},"reported": {"asd": "xyz","qwe": "qwe"}}}';

          try {
            var message = new Paho.MQTT.Message(payload);
            message.destinationName = topic;
            self.client.send(message);
          } catch (e) {
            this.emit('publishFailed', e);
          }
        },
        useSSL: true,
        timeout: 3,
        mqttVersion: 4,
        onFailure: function () {
          console.error('connect failed');
        }
      };
      self.client.connect(connectOptions);

      self.client.onMessageArrived = function (message) {

        try {
          console.log("msg arrived: " +  message.payloadString);
        } catch (e) {
          console.log("error! " + e);
        }

      };
    }

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

    initClient(self.requestUrl);

    // Set up API calls

    var apigClient = apigClientFactory.newClient({
      accessKey: $localStorage.accessKey,
      secretKey: $localStorage.secretKey,
      sessionToken: $localStorage.sessionToken,
      region: $localStorage.region
    });

    self.plantDetails = siteService.getPlant();

    self.updatePlant = function() {
      var params = {};
      var body = self.plantDetails;

      apigClient.plantsUpdatePost(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
          console.log("Error: " + JSON.stringify(result));
        });
    };

    self.deletePlant = function() {
      var params = {
        plantId: self.plantDetails.plantId
      };

      var body = {};

      apigClient.plantsDeletePlantIdGet(params, body)
        .then(function (result) {
          console.log("Success: " + JSON.stringify(result));
        }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
      });
    };
  }
});
