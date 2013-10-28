var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;

    AnimateDataviz.duration = 1000 * 30;

    AnimateDataviz.pause = 1000 * 10 ;

    AnimateDataviz.stations;
        
    AnimateDataviz.data_acum;

    AnimateDataviz.$panels = $('.panel');
    
    AnimateDataviz.$usuarios = $('#usuarios');
    AnimateDataviz.$recorridos = $('#recorridos');
    AnimateDataviz.$kms = $('#kms');

    window.odometerOptions = {
          auto: false, // Don't automatically initialize everything with class 'odometer'
          format: '(.ddd),dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
          duration: 10000000 // Change how long the javascript expects the CSS animation to take
        };

    AnimateDataviz.init = function (){
		d3.csv("data/estaciones_fecha.csv", function(stations) {
            AnimateDataviz.stations = stations;
            d3.csv("data/accumRecorBici.csv", function(data_acum) {
                AnimateDataviz.data_acum = data_acum;
    			AnimateDataviz.graph = d3.animate_dataviz('graph-container',stations,data_acum,AnimateDataviz.duration,AnimateDataviz.pause);
                AnimateDataviz.start();
            });
        });
    };

    AnimateDataviz.startOdometers = function(){
        var a = new Odometer({
          el: document.querySelector('#usuarios'),
          value: 0,
          duration: 10000
        });

        var b = new Odometer({
          el: document.querySelector('#recorridos'),
          value: 0,
          duration: 20000
        });

        var c = new Odometer({
          el: document.querySelector('#kms'),
          value: 0,
          duration: 20000
        });
    };

    AnimateDataviz.start = function(){
        AnimateDataviz.startOdometers();
        AnimateDataviz.graph.start();
        $('#usuarios').html(85793);
        $('#recorridos').html(1815274);
        $('#kms').html(5794413);
        setInterval(AnimateDataviz.everyStart,AnimateDataviz.duration+AnimateDataviz.pause);
    };

    AnimateDataviz.everyStart = function(){
        AnimateDataviz.graph.start();
        AnimateDataviz.switchPanel();
    };

    AnimateDataviz.switchPanel = function(){
        AnimateDataviz.$panels.toggleClass('panel-hide');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}