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

    MapaInteractivo.init = function (){
    	MapaInteractivo.controls.on('click', MapaInteractivo.clickControl);
        MapaInteractivo.mapa = new usig.MapaInteractivo('mapa', {
            rootUrl: '../',
            zoomBar: false,
            includeMapSwitcher: false,
            includeToolbar: false,
            includePanZoomBar: true,
            baseLayer: 'mapabsas_red_de_ciclovias_basico',
            onReady: function() {
                MapaInteractivo.addLayers();
            }

        });
    };

    MapaInteractivo.addLayers = function(){
        MapaInteractivo.capa2 = MapaInteractivo.mapa.addVectorLayer('comercios_con_beneficios', { 
                    url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=comercios_con_beneficios&formato=geojson",
                    symbolizer: {
                        externalGraphic: 'http://mapa.buenosaires.gov.ar/images/markers/comercios_con_beneficios.png',
                        backgroundGraphic: 'http://mapa.buenosaires.gov.ar/images/markers/fondos/1.png',
                        pointRadius: 30
                    },
                    format: 'geojson',
                    minPointRadius: 9,
                    popup: true,
                    onClick: MapaInteractivo.clickHandler
                });

        MapaInteractivo.capa1 = MapaInteractivo.mapa.addVectorLayer('estacionamiento_de_bicicletas', { 
                    url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=estacionamiento_de_bicicletas&formato=geojson",
                    symbolizer: {
                        externalGraphic: 'http://mapa.buenosaires.gov.ar/images/markers/estacionamiento_de_bicicletas.png',
                        pointRadius: 30
                    },
                    format: 'geojson',
                    minPointRadius: 9,
                    popup: true,
                    onClick: MapaInteractivo.clickHandler
        });

        MapaInteractivo.capa3 = MapaInteractivo.mapa.addVectorLayer('bicicleterias', { 
                    url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=bicicleterias&formato=geojson",
                    symbolizer: {
                        externalGraphic: 'http://mapa.buenosaires.gov.ar/images/markers/bicicleteria.png',
                        backgroundGraphic: 'http://mapa.buenosaires.gov.ar/images/markers/fondos/2.png',
                        pointRadius: 30
                    },
                    format: 'geojson',
                    minPointRadius: 9,
                    popup: true,
                    onClick: MapaInteractivo.clickHandler
        });        
    }

    MapaInteractivo.clickControl = function (){
    	var rel = $(this).attr('rel');
        $(this).toggleClass('btn-inverse');
        MapaInteractivo.mapa.toggleLayer(MapaInteractivo[rel]);
    };

    MapaInteractivo.clickHandler = function (e, popup) {
        if (popup) {
            popup.contentDiv.innerHTML = "<h3>" + e.feature.attributes['Nombre'] +"</h3><p class='indicator'>Buscando informaci&oacute;n...</p>";
            popup.updateSize();
            popup.show();
            $.ajax({
                url: "http://epok.buenosaires.gob.ar/getObjectContent/",
                data: {
                    id: e.feature.attributes['Id']
                },
                dataType: 'jsonp',
                success: function(data) {
                    console.log(data);
                    if (popup != null) {
                        var $div = $(popup.contentDiv);
                        $('p.indicator', $div).remove();
                        var content = '<ul style="width: 300px; list-style-type: none; margin: 5px 0; padding: 0;">';
                        $.each(data.contenido, function(k, v) {
                            if (v.nombreId != 'nombre' && v.valor != '') {
                                content+='<li><b>'+v.nombre+'</b>: '+v.valor+'</li>';
                            }
                        });
                        content+='</ul>';
                        $div.append(content);
                        popup.updateSize();
                    }
                },
                error: function(e) {
                    usig.debug(e);
                }
            });
        }
    };


})(window, document,jQuery);

window.onload = function() {
    MapaInteractivo.init(); 
}