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
}).
directive('plantDetailCanvasDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    var canvas = document.getElementById('live-chart-temperature');
    var canvas2 = document.getElementById('live-chart-humidity');
    var aggregateCanvas = document.getElementById('live-chart-aggregate');
    var ctx = canvas.getContext('2d');
    var ctx2 = canvas2.getContext('2d');
    var ctxAggregate = aggregateCanvas.getContext('2d');
    var startingData = {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };
    var latestLabel = startingData.labels[6];

    var startingData2 = {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };
    var latestLabel2 = startingData2.labels[6];

    var aggregateData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      datasets: [{
        label: 'apples',
        backgroundColor: "rgba(153,255,51,0.4)",
        borderColor: "rgba(153,255,51,1)",
        data: [12, 19, 3, 17, 28, 24, 7]
      },
      {
        label: 'oranges',
        backgroundColor: "rgba(255,153,0,0.4)",
        borderColor: "rgba(255,153,0,1)",
        data: [30, 29, 5, 5, 20, 3, 10]
      }]
    };

    var liveChart = new Chart(ctx, {
      type: "line",
      data: startingData
    });

    var liveChart2 = new Chart(ctx2, {
      type: "line",
      data: startingData2
    });

    var aggregateChar = new Chart(ctxAggregate, {
      type: "radar",
      data: aggregateData
    });

    var charts = [];

    var timeConverter = function (now){
      var a = new Date(now);
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();

      hour = "" + hour;
      if (hour.length == 1) {
        hour = "0" + hour;
      }

      min = "" + min;
      if (min.length == 1) {
        min = "0" + min;
      }

      sec = "" + sec;
      if (sec.length == 1) {
        sec = "0" + sec;
      }
      return hour + ':' + min + ':' + sec;
    };

    var moveChart = function(chart, newData) {
      var now = timeConverter(Date.now());

      chart.data.labels.push(now); // add new label at end
      if (chart.data.labels.length > 7) {
        chart.data.labels.splice(0, 1); // remove first label
      }

      chart.data.datasets.forEach(function(dataset, index) {
        dataset.data.push(newData[index]); // add new data at end
        if (dataset.data.length > 7) {
          dataset.data.splice(0, 1); // remove first data point
        }
      });

      chart.update(1000);
    };

    var values = {};
    var graphs = [];

    scope.$watch(attributes.ngModel, function (value) {
      var val = value;
      if (val == 'connected') {
        scope.$ctrl.client.onMessageArrived = function (message) {
          try {
            console.log("message arrived: " +  message.payloadString);

            var temperature = JSON.parse(message.payloadString).state.reported.temperature;
            moveChart(liveChart, [temperature]);

            var humidity = JSON.parse(message.payloadString).state.reported.humidity;
            moveChart(liveChart2, [humidity]);

            /*var reported = JSON.parse(message.payloadString).state.reported;

            // check if new values
            jQuery.each(reported, function(key, val) {
              if (values[key] == null) {
                // new key
                values[key] = val;

                // create new graph

              }
            });

            // update graphs
            var i = 0;
            jQuery.each(values, function(key, val) {
              moveChart(chart[i], [val]);
              ++i;
            });*/
          } catch (e) {
            console.log("error! " + e);
          }
        };
      }
    });
  };

  return {
    link: linkFunction
  };
});
