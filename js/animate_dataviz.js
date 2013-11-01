var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;
    AnimateDataviz.map;

    AnimateDataviz.duration = 1000 * 120;

    AnimateDataviz.pause = 1000 * 10;

    AnimateDataviz.stations;
        
    AnimateDataviz.data_acum;

    AnimateDataviz.currentPanel = 'NUMBERS';

    AnimateDataviz.currentMonth = '';

    AnimateDataviz.currentYear = '';

    AnimateDataviz.$panels = $('.panel');
    
    //Counters
    AnimateDataviz.$usuarios;
    AnimateDataviz.$recorridos;
    AnimateDataviz.$kms;

    //Convertions
    AnimateDataviz.$colon;
    AnimateDataviz.$luna;
    AnimateDataviz.$co2;
    AnimateDataviz.$calorias;
    AnimateDataviz.$hamburguesas;
    AnimateDataviz.$ahorro;

    //Current
    AnimateDataviz.$fecha_m = $('#current_month');
    AnimateDataviz.$fecha_y = $('#current_year');  

    AnimateDataviz.$hito = $('#hito-container');    

    AnimateDataviz.meses= {
      '01':'Enero',
      '02':'Febrero',
      '03':'Marzo',
      '04':'Abril',
      '05':'Mayo',
      '06':'Junio',
      '07':'Julio',
      '08':'Agosto',
      '09':'Septiembre',
      '10':'Octubre',
      '11':'Noviembre',
      '12':'Diciembre'
    };

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
          .defer(d3.csv, 'data/hitos.csv')
          .awaitAll(AnimateDataviz.filesLoaded);

    };

    AnimateDataviz.filesLoaded = function(error, results){
        AnimateDataviz.stations = results[0];
        AnimateDataviz.data_acum = results[1];
        AnimateDataviz.usuarios_mes = results[2];
        AnimateDataviz.kms_mes = results[3];
        AnimateDataviz.clima = results[4];
        AnimateDataviz.hitos = d3.nest()
            .key(function(d) { return d.Fecha; })
            .rollup(function(d) { return d[0]; })
            .map(results[5],d3.map);

        AnimateDataviz.graph = d3.animate_dataviz('graph-container',
                AnimateDataviz.stations,
                AnimateDataviz.data_acum,
                AnimateDataviz.duration,
                AnimateDataviz.pause,
                AnimateDataviz.usuarios_mes);

        AnimateDataviz.map = d3.animate_map('map-container',
                AnimateDataviz.stations,
                AnimateDataviz.hitos);

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

        var f = new Odometer({
          el: document.querySelector('#co2'),
          value: 0
        });

        var g = new Odometer({
          el: document.querySelector('#calorias'),
          value: 0,
          format: '(.ddd),dd'
        });

        var h = new Odometer({
          el: document.querySelector('#hamburguesas'),
          value: 0,
          format: '(.ddd),dd'
        });

        var i = new Odometer({
          el: document.querySelector('#ahorro'),
          value: 0,
          format: '(.ddd),dd'
        });

        AnimateDataviz.$usuarios = $('#usuarios');
        AnimateDataviz.$recorridos = $('#recorridos');
        AnimateDataviz.$kms = $('#kms');

        AnimateDataviz.$colon = $('#teatro-colon');
        AnimateDataviz.$luna = $('#viaje-luna');
        AnimateDataviz.$co2 = $('#co2');
        AnimateDataviz.$calorias = $('#calorias');
        AnimateDataviz.$hamburguesas = $('#hamburguesas');
        AnimateDataviz.$ahorro = $('#ahorro');

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

                if(AnimateDataviz.currentMonth!=AnimateDataviz.meses[current[1]]){
                    AnimateDataviz.currentMonth = AnimateDataviz.meses[current[1]];
                    AnimateDataviz.$fecha_m.fadeOut('slow',function(){
                        $(this).html(AnimateDataviz.meses[current[1]]).fadeIn();
                    });
                }

                if(AnimateDataviz.currentYear!=current[0]){
                    AnimateDataviz.currentYear = current[0];
                    AnimateDataviz.$fecha_y.fadeOut('slow',function(){
                        $(this).html(current[0]).fadeIn();
                    });
                }

                if(AnimateDataviz.currentPanel == 'MAP'){
                    AnimateDataviz.map.update(AnimateDataviz.clima[i].dia);
                    if( AnimateDataviz.hitos.get(current[1]+'/'+current[2]+'/'+current[0]) ){
                        AnimateDataviz.$hito.find('#hito').hide().html(AnimateDataviz.hitos.get(current[1]+'/'+current[2]+'/'+current[0]).Hito).fadeIn();
                        AnimateDataviz.$hito.find('#hito-fecha').hide().html(current[2] +' de ' + AnimateDataviz.meses[current[1]] +' de '+current[0]).fadeIn();
                    }
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
            AnimateDataviz.$luna.html(Math.round(AnimateDataviz.kms_mes[i].trDistance_Accum/386160)); //Viaje ida
            AnimateDataviz.$co2.html( Math.round((AnimateDataviz.kms_mes[i].trDistance_Accum*0.156)/1000) ); //Toneladas
            AnimateDataviz.$calorias.html(Math.round((AnimateDataviz.kms_mes[i].trDistance_Accum*58.5)/1000000 )); //Millones
            AnimateDataviz.$hamburguesas.html(Math.round((AnimateDataviz.kms_mes[i].trDistance_Accum*58.5*0.0023) ));
            AnimateDataviz.$ahorro.html(Math.round(AnimateDataviz.kms_mes[i].trDistance_Accum/1.30)); 
            return true;
        }
        return false;
    };

    AnimateDataviz.clearNumbers = function(){
        AnimateDataviz.$usuarios.html(1);
        AnimateDataviz.$recorridos.html(1);
        AnimateDataviz.$kms.html(1);
        AnimateDataviz.$co2.html(1);
        AnimateDataviz.$calorias.html(1);
        AnimateDataviz.$hamburguesas.html(1);
        AnimateDataviz.$colon.html(1);
        AnimateDataviz.$luna.html(1);
        AnimateDataviz.$ahorro.html(1);

        AnimateDataviz.$usuarios.html(0);
        AnimateDataviz.$recorridos.html(0);
        AnimateDataviz.$kms.html(0);
        AnimateDataviz.$co2.html(0);
        AnimateDataviz.$calorias.html(0);
        AnimateDataviz.$hamburguesas.html(0);
        AnimateDataviz.$colon.html(0);
        AnimateDataviz.$luna.html(0);
        AnimateDataviz.$ahorro.html(0);
    };

    AnimateDataviz.updateMap = function(d){
        AnimateDataviz.$hito.show();
    };

    AnimateDataviz.clearMap = function(){
        AnimateDataviz.map.clear();
        AnimateDataviz.$hito.hide();
    };
    
    AnimateDataviz.everyStart = function(){
        clearInterval(AnimateDataviz.intervalIDDays);
        clearInterval(AnimateDataviz.intervalID);
        AnimateDataviz.currentYear = '2010';
        AnimateDataviz.$fecha_y.hide().html('2010').fadeIn();
        AnimateDataviz.$fecha_m.hide().html('DICIEMBRE').fadeIn();
        AnimateDataviz.switchPanel();
        AnimateDataviz.updateDays();
        AnimateDataviz.graph.start();
    };

    AnimateDataviz.switchPanel = function(){
        AnimateDataviz.$panels.toggleClass('panel-hide');
        if($('.panel').not('.panel-hide').is('#map-container')){
            AnimateDataviz.currentPanel = 'MAP';
            AnimateDataviz.clearNumbers();
            AnimateDataviz.updateMap();
        } else {
            AnimateDataviz.currentPanel = 'NUMBERS';
            AnimateDataviz.clearMap();
            AnimateDataviz.updateNumbers();
        }
    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}