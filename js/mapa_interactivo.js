var MapaInteractivo;

;(function(global, document, $){

    "use strict";

    MapaInteractivo = global.MapaInteractivo = global.MapaInteractivo || {};

    MapaInteractivo.mapa;

    MapaInteractivo.controls = $('.control');

    MapaInteractivo.capas = $('.capa');

    MapaInteractivo.capa1 = $('#capa1');
    MapaInteractivo.capa2 = $('#capa2');
    MapaInteractivo.capa3 = $('#capa3');

    MapaInteractivo.selected = '';

    MapaInteractivo.init = function (){
    	MapaInteractivo.controls.on('click', MapaInteractivo.clickControl);
        MapaInteractivo.mapa = new usig.MapaInteractivo('mapa', {
            rootUrl: '../',
            zoomBar: false,
            includeMapSwitcher: false,
            includeToolbar: false,
            includePanZoomBar: true,
            onReady: function() {
                MapaInteractivo.addLayers();
            }

        });
    };

    MapaInteractivo.addLayers = function(){
        MapaInteractivo.capa1 = MapaInteractivo.mapa.addVectorLayer('bibliotecas1', { 
                    url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=dependencias_culturales&actividades=22",
                    symbolizer: {
                        externalGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/planetario.png',
                        backgroundGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/fondos/cir_verde.png',
                        pointRadius: 18
                    },
                    minPointRadius: 9,
                    popup: true,
                    onClick: MapaInteractivo.clickHandler
                });

        MapaInteractivo.capa2 = MapaInteractivo.mapa.addVectorLayer('bibliotecas2', { 
            url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=dependencias_culturales&actividades=22",
            symbolizer: {
                externalGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/planetario.png',
                backgroundGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/fondos/cir_rojo.png',
                pointRadius: 18
            },
            minPointRadius: 9,
            popup: true,
            onClick: MapaInteractivo.clickHandler
        });

        MapaInteractivo.capa3 = MapaInteractivo.mapa.addVectorLayer('bibliotecas3', { 
            url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=dependencias_culturales&actividades=22",
            symbolizer: {
                externalGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/planetario.png',
                backgroundGraphic: 'http://servicios.usig.buenosaires.gov.ar/usig-js/3.0/ejemplos/gml/images/fondos/cir_azul.png',
                pointRadius: 18
            },
            minPointRadius: 9,
            popup: true,
            onClick: MapaInteractivo.clickHandler
        });        
    }

    MapaInteractivo.clickHandler = function (){
        console.log('click a la nada');
    };

    MapaInteractivo.clickControl = function (){
    	var rel = $(this).attr('rel');
    	if(MapaInteractivo.selected != rel){
    		MapaInteractivo.selected = rel;
            MapaInteractivo.mapa.toggleLayer(MapaInteractivo[rel]);
    	}
    };

})(window, document,jQuery);

window.onload = function() {
    MapaInteractivo.init(); 
}