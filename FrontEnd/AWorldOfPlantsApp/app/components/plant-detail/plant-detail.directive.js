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
directive('pausePlay', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('#btnAggregatePausePlay').on('click', function () {
      var aggregatePausePlay = $('#aggregatePausePlay');

      if (aggregatePausePlay.hasClass('fa-pause')) {
        aggregatePausePlay.removeClass('fa-pause');
        aggregatePausePlay.addClass('fa-play');

        scope.$ctrl.chartStatus.aggregate = false;
      } else if (aggregatePausePlay.hasClass('fa-play')) {
        aggregatePausePlay.removeClass('fa-play');
        aggregatePausePlay.addClass('fa-pause');

        scope.$ctrl.chartStatus.aggregate = true;
      }

      $scope.$apply();
    });
  };

  return {
    link: linkFunction
  };
}).
directive('plantDetailCanvasDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    var tempCanvas = document.getElementById('live-chart-temperature');
    var humidityCanvas = document.getElementById('live-chart-humidity');
    var moistureCanvas = document.getElementById('live-chart-moisture');
    var aggregateCanvas = document.getElementById('live-chart-aggregate');
    var aggregateLineCanvas = document.getElementById('live-chart-aggregate-line');

    var ctxTemp = tempCanvas.getContext('2d');
    var ctxHumidity = humidityCanvas.getContext('2d');
    var ctxMoisture = moistureCanvas.getContext('2d');
    var ctxAggregate = aggregateCanvas.getContext('2d');
    var ctxAggregateLine = aggregateLineCanvas.getContext('2d');

    var tempData = {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255, 193 , 7, 0.4)",
          borderColor: "rgba(255, 193 , 7, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(255, 193 , 7, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(255, 193 , 7, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var humidityData = {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(219, 68, 55, 0.4)",
          borderColor: "rgba(219, 68, 55, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(219, 68, 55, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(219, 68, 55, 1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var moistureData = {
      labels: [],
      datasets: [
        {
          label: "Moisture",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(66, 133, 244, 0.4)",
          borderColor: "rgba(66, 133, 244, 1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(66, 133, 244, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderColor: "rgba(66, 133, 244, 1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
          spanGaps: false
        }
      ]
    };

    var aggregateData = {
      labels: [],
      datasets: [{
        label: 'Temperature',
        backgroundColor: "rgba(255, 193 , 7, 0.4)",
        borderColor: "rgba(255, 193 , 7, 1)",
        data: []
      },
      {
        label: 'Humidity',
        backgroundColor: "rgba(219, 68, 55, 0.4)",
        borderColor: "rgba(219, 68, 55, 1)",
        data: []
      },
      {
        label: 'Moisture',
        backgroundColor: "rgba(66, 133, 244, 0.4)",
        borderColor: "rgba(66, 133, 244, 1)",
        data: []
      }]
    };

    var aggregateLineData = {
      labels: [],
      datasets: [{
        label: 'Temperature',
        backgroundColor: "rgba(255, 193 , 7, 0.4)",
        borderColor: "rgba(255, 193 , 7, 1)",
        data: []
      },
        {
          label: 'Humidity',
          backgroundColor: "rgba(219, 68, 55, 0.4)",
          borderColor: "rgba(219, 68, 55, 1)",
          data: []
        },
        {
          label: 'Moisture',
          backgroundColor: "rgba(66, 133, 244, 0.4)",
          borderColor: "rgba(66, 133, 244, 1)",
          data: []
        }]
    };

    var tempChart = new Chart(ctxTemp, {
      type: "line",
      data: tempData
    });

    var humidityChart = new Chart(ctxHumidity, {
      type: "line",
      data: humidityData
    });

    var moistureChart = new Chart(ctxMoisture, {
      type: "line",
      data: moistureData
    });

    var aggregateChart = new Chart(ctxAggregate, {
      type: "radar",
      data: aggregateData
    });

    var aggregateLineChart = new Chart(ctxAggregateLine, {
      type: "line",
      data: aggregateLineData
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
            moveChart(tempChart, [temperature]);

            var humidity = JSON.parse(message.payloadString).state.reported.humidity;
            moveChart(humidityChart, [humidity]);

            var moisture = JSON.parse(message.payloadString).state.reported.moisture;
            moveChart(moistureChart, [moisture]);

            if (scope.$ctrl.chartStatus.aggregate == true) {
              moveChart(aggregateChart, [temperature, humidity, moisture]);
            }
            moveChart(aggregateLineChart, [temperature, humidity, moisture]);

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
