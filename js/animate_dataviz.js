var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;
    AnimateDataviz.map;

    AnimateDataviz.duration = 1000 * 20;

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

    //Current
    AnimateDataviz.$fecha_m = $('#current_month');
    AnimateDataviz.$fecha_y = $('#current_year');    

    window.odometerOptions = {
          auto: false,
          format: '(.ddd),dd'
        };

    AnimateDataviz.init = function (){

        queue()
          .defer(d3.csv, 'data/EstacionesF.csv')
          .defer(d3.csv, 'data/accumRecorBici.csv')
          .defer(d3.csv, 'data/UsuariosXMes.csv')
          .defer(d3.csv, 'data/biciKmMes.csv')
          .defer(d3.csv, 'data/clima.csv')
          .awaitAll(AnimateDataviz.filesLoaded);

    };

    AnimateDataviz.filesLoaded = function(error, results){
        AnimateDataviz.stations = results[0];
        AnimateDataviz.data_acum = results[1];
        AnimateDataviz.usuarios_mes = results[2];
        AnimateDataviz.kms_mes = results[3];
        AnimateDataviz.clima = results[4];
        AnimateDataviz.graph = d3.animate_dataviz('graph-container',
                AnimateDataviz.stations,
                AnimateDataviz.data_acum,
                AnimateDataviz.duration,
                AnimateDataviz.pause,
                AnimateDataviz.usuarios_mes);

        AnimateDataviz.map = d3.animate_map('map-container',AnimateDataviz.stations);

        AnimateDataviz.start();
    };

    AnimateDataviz.startOdometers = function(){
        var a = new Odometer({
          el: document.querySelector('#usuarios'),
          value: 0,
          format: '(.ddd),dd'
        });

        var b = new Odometer({
          el: document.querySelector('#recorridos'),
          value: 0,
          format: '(.ddd),dd'
        });

        var c = new Odometer({
          el: document.querySelector('#kms'),
          value: 0,
          format: '(.ddd),dd'
        });

        var d = new Odometer({
          el: document.querySelector('#teatro-colon'),
          value: 0,
          format: '(.ddd),dd'
        });

        var e = new Odometer({
          el: document.querySelector('#viaje-luna'),
          value: 0,
          format: '(.ddd),dd'
        });


        var g = new Odometer({
          el: document.querySelector('#current_month'),
          value: 0,
          format: '(.ddd),dd'
        });

        var h = new Odometer({
          el: document.querySelector('#current_year'),
          value: 0,
          format: '(.ddd),dd'
        });

        AnimateDataviz.$usuarios = $('#usuarios');
        AnimateDataviz.$recorridos = $('#recorridos');
        AnimateDataviz.$kms = $('#kms');

        AnimateDataviz.$colon = $('#teatro-colon');
        AnimateDataviz.$luna = $('#viaje-luna');

        AnimateDataviz.$fecha_m = $('#current_month');
        AnimateDataviz.$fecha_y = $('#current_year'); 
    };

    AnimateDataviz.start = function(){
        AnimateDataviz.startOdometers();
        AnimateDataviz.graph.start();
        AnimateDataviz.updateNumbers();
        AnimateDataviz.updateDays();
        setInterval(AnimateDataviz.everyStart,AnimateDataviz.duration+AnimateDataviz.pause);
    };

    AnimateDataviz.intervalID;

    AnimateDataviz.updateNumbers = function(){
        var r = AnimateDataviz.duration / AnimateDataviz.data_acum.length;
        var i = 0;
        AnimateDataviz.intervalID = setInterval(function(){
            if(
                AnimateDataviz.updateRecorridos(i) && 
                AnimateDataviz.updateUsuarios(i) &&
                AnimateDataviz.updateKms(i)
                ){
                i++;
            } else {
                i = 0;
                clearInterval(AnimateDataviz.intervalID);
            }
        },r);
    };

    AnimateDataviz.intervalIDDays;

    AnimateDataviz.updateDays = function(){
        var r = AnimateDataviz.duration / AnimateDataviz.clima.length;
        var i = 0;
        var current;
        AnimateDataviz.intervalIDDays = setInterval(function(){
            if(AnimateDataviz.clima[i]){
                current = AnimateDataviz.clima[i].dia.split('/');
                AnimateDataviz.$fecha_y.html(current[0]);
                AnimateDataviz.$fecha_m.html(current[1]);

                if(AnimateDataviz.currentPanel == 'MAP'){
                    AnimateDataviz.map.update(AnimateDataviz.clima[i].dia);
                }
                i++;
            } else {
                i = 0;
                clearInterval(AnimateDataviz.intervalIDDays);
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

    AnimateDataviz.updateMap = function(d){
        //TODO
    };

    AnimateDataviz.clearMap = function(){
        AnimateDataviz.map.clear();
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
        AnimateDataviz.updateDays();
        AnimateDataviz.graph.start();
    };

    AnimateDataviz.switchPanel = function(){
        AnimateDataviz.$panels.toggleClass('panel-hide');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}