var ExpoCircular;

;(function(global, document, $, d3){

    "use strict";

    ExpoCircular = global.ExpoCircular = global.ExpoCircular || {};

    ExpoCircular.mapa;

    ExpoCircular.init = function (){

		d3.csv("data/estaciones.csv", function(stations) {
		  d3.json("data/matriz_viajes.json", function(matrix) {
			ExpoCircular.mapa = d3.dataviz_circular('map-container',stations,matrix);
		  });
		});

    };

})(window, document,jQuery, d3);

window.onload = function() {
    ExpoCircular.init(); 
}