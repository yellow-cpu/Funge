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
  };

  return {
    link: linkFunction
  };
}).
directive('deletePlantDirective', function () {
  var linkFunction = function (scope, element, attributes) {
    $('#deletePlantModal').on('hidden.bs.modal', function () {
      $('#plantError').css({
        "display": "none"
      });
    });

    $('#deletePlant').on('click', function() {
      var plantName = $('#plantName').val();

      if (plantName == scope.$ctrl.plantDetails.plantName) {
        $('#deletePlantModal').modal('hide');
        scope.$ctrl.deletePlant();
      } else {
        $('#plantError').css({
          "display": "inline-block"
        });
      }
    });
  };

  return {
    link: linkFunction
  }
}).
directive('statusDirective', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    scope.$watch(attributes.ngModel, function (value) {
      var val = value;
      if (val == "connected") {
        var mqttStatus = $('#mqttStatus');
        mqttStatus.removeClass('alert-danger');
        mqttStatus.addClass('alert-success');
        mqttStatus.html("Connected to plant box: " + scope.$ctrl.thing.thingName);
      }
    });
  };

  return {
    link: linkFunction
  };
}).
directive('pausePlay', function($compile) {
  var linkFunction = function (scope, element, attributes) {
    $('.btnPausePlay').on('click', function () {
      var pausePlay = $(this).find('.pausePlay');

      var chartData = $(this).data('chart');

      if (pausePlay.hasClass('fa-pause')) {
        pausePlay.removeClass('fa-pause');
        pausePlay.addClass('fa-play');

        if (chartData == "temp") {
          scope.$ctrl.chartStatus.temp = false;
        } else if (chartData == "humidity") {
          scope.$ctrl.chartStatus.humidity = false;
        } else if (chartData == "moisture") {
          scope.$ctrl.chartStatus.moisture = false;
        } else if (chartData == "aggregate") {
          scope.$ctrl.chartStatus.aggregate = false;
        }
      } else if (pausePlay.hasClass('fa-play')) {
        pausePlay.removeClass('fa-play');
        pausePlay.addClass('fa-pause');

        if (chartData == "temp") {
          scope.$ctrl.chartStatus.temp = true;
        } else if (chartData == "humidity") {
          scope.$ctrl.chartStatus.humidity = true;
        } else if (chartData == "moisture") {
          scope.$ctrl.chartStatus.moisture = true;
        } else if (chartData == "aggregate") {
          scope.$ctrl.chartStatus.aggregate = true;
        }
      }
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
            if (scope.$ctrl.chartStatus.temp == true) {
              moveChart(tempChart, [temperature]);
            }

            var humidity = JSON.parse(message.payloadString).state.reported.humidity;
            if (scope.$ctrl.chartStatus.humidity == true) {
              moveChart(humidityChart, [humidity]);
            }

            var moisture = JSON.parse(message.payloadString).state.reported.moisture;
            if (scope.$ctrl.chartStatus.moisture == true) {
              moveChart(moistureChart, [moisture]);
            }

            if (scope.$ctrl.chartStatus.aggregate == true) {
              moveChart(aggregateChart, [temperature, humidity, moisture]);
              moveChart(aggregateLineChart, [temperature, humidity, moisture]);
            }
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
