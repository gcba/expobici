var ExpoCircular;

;(function(global, document, $, d3){

    "use strict";

    ExpoCircular = global.ExpoCircular = global.ExpoCircular || {};

    ExpoCircular.mapa;

    ExpoCircular.init = function (){
    	console.log('Do awesome stuff!');
    	ExpoCircular.mapa = d3.dataviz_circular('map-container');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    ExpoCircular.init(); 
}