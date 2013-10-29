var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;

    AnimateDataviz.duration = 1000 * 30;

    AnimateDataviz.pause = 1000 * 10 ;

    AnimateDataviz.stations;
        
    AnimateDataviz.data_acum;

    AnimateDataviz.currentPanel = 'NUMBERS';

    AnimateDataviz.$panels = $('.panel');
    
    //Counters
    AnimateDataviz.$usuarios;
    AnimateDataviz.$recorridos;
    AnimateDataviz.$kms;

    //Convertions
    AnimateDataviz.$colon;
    AnimateDataviz.$luna;

    window.odometerOptions = {
          auto: false,
          format: '(.ddd),dd'
        };

    AnimateDataviz.init = function (){

        queue()
          .defer(d3.csv, 'data/estaciones_fecha.csv')
          .defer(d3.csv, 'data/accumRecorBici.csv')
          .defer(d3.csv, 'data/UsuariosXMes.csv')
          .defer(d3.csv, 'data/biciKmMes.csv')
          .awaitAll(AnimateDataviz.filesLoaded);

    };

    AnimateDataviz.filesLoaded = function(error, results){
        AnimateDataviz.stations = results[0];
        AnimateDataviz.data_acum = results[1];
        AnimateDataviz.usuarios_mes = results[2];
        AnimateDataviz.kms_mes = results[3];
        AnimateDataviz.graph = d3.animate_dataviz('graph-container',
                AnimateDataviz.stations,
                AnimateDataviz.data_acum,
                AnimateDataviz.duration,
                AnimateDataviz.pause,
                AnimateDataviz.usuarios_mes);
        AnimateDataviz.start();
    };

    AnimateDataviz.startOdometers = function(){
        var a = new Odometer({
          el: document.querySelector('#usuarios'),
          value: 0
        });

        var b = new Odometer({
          el: document.querySelector('#recorridos'),
          value: 0
        });

        var c = new Odometer({
          el: document.querySelector('#kms'),
          value: 0
        });

        var d = new Odometer({
          el: document.querySelector('#teatro-colon'),
          value: 0
        });

        var e = new Odometer({
          el: document.querySelector('#viaje-luna'),
          value: 0
        });

        AnimateDataviz.$usuarios = $('#usuarios');
        AnimateDataviz.$recorridos = $('#recorridos');
        AnimateDataviz.$kms = $('#kms');

        AnimateDataviz.$colon = $('#teatro-colon');
        AnimateDataviz.$luna = $('#viaje-luna');
    };

    AnimateDataviz.start = function(){
        AnimateDataviz.startOdometers();
        AnimateDataviz.graph.start();
        AnimateDataviz.updateNumbers();
        setInterval(AnimateDataviz.everyStart,AnimateDataviz.duration+AnimateDataviz.pause);
    };

    AnimateDataviz.updateNumbers = function(){
        var r = AnimateDataviz.duration / AnimateDataviz.data_acum.length;
        var i = 0;
        var intervalID = setInterval(function(){
            if(
                AnimateDataviz.updateRecorridos(i) && 
                AnimateDataviz.updateUsuarios(i) &&
                AnimateDataviz.updateKms(i)
                ){
                i++;
            } else {
                i = 0;
                clearInterval(intervalID);
            }
        },r);
    };

    AnimateDataviz.updateRecorridos = function(i){
        if(AnimateDataviz.data_acum[i]){
            AnimateDataviz.$recorridos.html(AnimateDataviz.data_acum[i].Acumm);
            return true;
        }
        return false;
    };

    AnimateDataviz.updateUsuarios = function(i){
        if(AnimateDataviz.usuarios_mes[i]){
            AnimateDataviz.$usuarios.html(AnimateDataviz.usuarios_mes[i].usuarios_acum);
            AnimateDataviz.$colon.html(Math.round(AnimateDataviz.usuarios_mes[i].usuarios_acum/3500));
            return true;
        }
        return false;
    };

    AnimateDataviz.updateKms = function(i){
        if(AnimateDataviz.kms_mes[i]){
            AnimateDataviz.$kms.html(Math.round(AnimateDataviz.kms_mes[i].trDistance_Accum));
            AnimateDataviz.$luna.html(Math.round(AnimateDataviz.kms_mes[i].trDistance_Accum/386160));
            return true;
        }
        return false;
    };

    AnimateDataviz.clearNumbers = function(){
        AnimateDataviz.$usuarios.html(1);
        AnimateDataviz.$recorridos.html(1);
        AnimateDataviz.$kms.html(1);
        AnimateDataviz.$usuarios.html(0);
        AnimateDataviz.$recorridos.html(0);
        AnimateDataviz.$kms.html(0);
    };

    AnimateDataviz.updateMap = function(){
        //TODO
    };

    AnimateDataviz.clearMap = function(){
        //TODO
    };
    
    AnimateDataviz.everyStart = function(){
        AnimateDataviz.switchPanel();
        if($('.panel').not('.panel-hide').is('#map-container')){
            AnimateDataviz.currentPanel = 'MAP';
            AnimateDataviz.clearNumbers();
            AnimateDataviz.updateMap();
        } else {
            AnimateDataviz.currentPanel = 'NUMBERS';
            AnimateDataviz.clearMap();
            AnimateDataviz.updateNumbers();
        }
        AnimateDataviz.graph.start();
    };

    AnimateDataviz.switchPanel = function(){
        AnimateDataviz.$panels.toggleClass('panel-hide');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}