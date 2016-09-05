'use strict';

// Register `landing` component, along with its associated controller and template
angular.
  module('landing').
  component('landing', {
    templateUrl: 'components/landing/landing.template.html',
    controller: function LandingController() {
      var self = this;

      var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
      $('html').bind(mousewheelevt, function(e){

        var evt = window.event || e //equalize event object
        evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible
        var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta //check for detail first, because it is used by Opera and FF

        if(delta > 0) {
          //scroll up
          setTimeout(function() {
            $('.arrow').css({
              'display' : 'block'
            });
          }, 1000);

        }
        else{
          // scroll down
          $('.arrow').css({
            'display' : 'none'
          });
        }
      });

      self.mainOptions = {
        sectionsColor: ['#36465D', '#36465D'],
        verticalCentered: false,
        navigation: true,
        navigationPosition: 'right',
        scrollingSpeed: 1000
      }
    }
  });
