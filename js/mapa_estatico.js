var MapaEstatico;

;(function(global, document, $){

    "use strict";

    MapaEstatico = global.MapaEstatico = global.MapaEstatico || {};

    MapaEstatico.mapa;

    MapaEstatico.controls = $('.control');

    MapaEstatico.capas = $('.capa');

    MapaEstatico.capa1 = $('#capa1');
    MapaEstatico.capa2 = $('#capa2');
    MapaEstatico.capa3 = $('#capa3');

    MapaEstatico.selected = '';

    MapaEstatico.init = function (){
    	MapaEstatico.controls.on('click', MapaEstatico.clickControl);
    };

    MapaEstatico.clickControl = function (){
    	var rel = $(this).attr('rel');
    	if(MapaEstatico.selected != rel){
    		MapaEstatico.selected = rel;
	    	MapaEstatico.capas.hide();
	    	MapaEstatico[rel].fadeIn();
    	}
    };

})(window, document,jQuery);

window.onload = function() {
    MapaEstatico.init(); 
}