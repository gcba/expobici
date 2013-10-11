var ExpoMapa;

;(function(global, document, $, d3){

    "use strict";

    ExpoMapa = global.ExpoMapa = global.ExpoMapa || {};

    ExpoMapa.mapa;

    ExpoMapa.init = function (){
    	console.log('Do awesome stuff!');
    	ExpoMapa.mapa = d3.mapa_bicis('map-container');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    ExpoMapa.init(); 
}