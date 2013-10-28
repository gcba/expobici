var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;

    AnimateDataviz.init = function (){

		d3.csv("data/estaciones_fecha.csv", function(stations) {
		  d3.csv("data/accumRecorBici.csv", function(data_acum) {
			AnimateDataviz.graph = d3.animate_dataviz('graph-container',stations,data_acum);
		  });
		});

    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}