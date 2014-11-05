d3.animate_dataviz = function(containerId, stations, data, aDuration, aPause, users) {

	var margin = {top: 20, right: 100, bottom: 30, left: 100},
	    width = 1080 - margin.left - margin.right,
	    height = 350 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y-%m").parse;
	var parseDateUsuarios = d3.time.format("%Y %m").parse;
	//var parseDateEstaciones = d3.time.format("%Y-%d-%m").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var x2 = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var y2 = d3.scale.linear()
	    .range([height, 0]);   

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(4)
	    .orient("right");

	var yAxis2 = d3.svg.axis()
	    .scale(y2)
	    .ticks(4)
	    .orient("left");

	var line = d3.svg.line()
	    .x(function(d) { return x(d.anioMes); })
	    .y(function(d) { return y(parseInt(d.Record_Count)); })
	    .interpolate("basis");

	var lineUsers = d3.svg.line()
	    .x(function(d) { return x2(d.fecha); })
	    .y(function(d) { return y2(parseInt(d.usuarios)); })
	    .interpolate("basis");

	var svg = d3.select("#"+containerId).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var setupEstacion;

	users.forEach(function(d) {
		d.fecha = parseDateUsuarios(d.fecha);
	});

/*	stations.forEach(function(d) {
		d.fecha = d.fecha.split(" ")[0];
		d.fecha = parseDateEstaciones(d.fecha);
	});

	setupEstacion = stations;*/

	data.forEach(function(d) {
      d.anioMes = parseDate(d.anioMes);
      d.Record_Count = +d.Record_Count;
    });

	var timeline,
		duration = aDuration,
		pause = aPause;

	function moverObjeto(objeto) {
		objeto
		.attr("x", function(d){
		  var pos = x(parseDate('2010-12'))
		  return pos + 10
		})
		.transition()
		.duration(duration*0.8)
		.ease('linear')
		.attr("x", function(d){
		  var pos = x(parseDate('2013-12')) + 10;
		  return pos;
		})
		.each("end", function() {
			d3.select(this)
			.attr("x", function(d) {
				var pos = x(parseDate('2013-12')) - 150;
		  		return pos;
			})
			.transition()
			.duration(duration*0.2)
			.ease('linear')
			.attr("x", function(d) {
				var pos = x(parseDate('2014-09')) - 150;
				return pos;
			});		
		});	
	}

    function draw(){

	    x.domain(d3.extent(data, function(d) { return d.anioMes; }));
  	    x2.domain(d3.extent(users, function(d) { return d.fecha; }));
	    y.domain(d3.extent(data, function(d) { return parseInt(d.Record_Count); }));
	    y2.domain(d3.extent(users, function(d) { return parseInt(d.usuarios); }));

	    svg.append("path")
	        .datum(data)
	        .attr("class", "line-recorridos")
	        .attr("d", line);

	    svg.append("path")
	        .datum(users)
	        .attr("class", "line-usuarios")
	        .attr("d", lineUsers);
	    
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    svg.append("g")
	        .attr("class", "y2 axis")
	        .attr("transform", "translate(" + width + ",0)")
	        .call(yAxis2);

	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);


	 /*   svg.selectAll("line.estacion")
			.data(setupEstacion).enter()
			.append("line")
			.attr("class", "estacion")
			.attr("x1", function(d){
			  return x(d.fecha)
			})
			.attr("x2", function(d){
			  return x(d.fecha)
			})
			.attr("y1",0)
			.attr("y2",height);*/

	    timeline = svg.append("line")
			.attr("class", "time")
			.attr("x1", function(d){
			  return x(parseDate('2010-12'))
			})
			.attr("x2", function(d){
			  return x(parseDate('2010-12'))
			})
			.attr("y1",0)
			.attr("y2",height);

		container = svg.append("g")
					   .data(data)
					   .attr("x", function(d){
						 var pos = x(parseDate('2010-12'))
						 return pos + 10
					   })
					   .attr("y",20)
					   .attr("height", 100)
				 	   .attr("width", 140);

		rect = container.append("rect")
			.attr("class", "info")
			.attr("x", function(d){
			  var pos = x(parseDate('2010-12'))
			  return pos + 10
			})
			.attr("y",20)
			.attr("height", 100)
			.attr("width", 140);

		labels = container.append("text")
						  .attr("x", function(d){
							var pos = x(parseDate('2010-12'))
							return pos + 20
						  })
						  .attr("y", 40)
						  .attr("class", "label-viajes")
						  .text("HOLA QUE TAL");	
	}

	var _startTransition = function (){
		timeline
		.attr("x1", function(d){
		  return x(parseDate('2010-12'))
		})
		.attr("x2", function(d){
		  return x(parseDate('2010-12'))
		})		
		.transition()
		.duration(duration)
		.ease('linear')
		.attr("x1", function(d){
		  return x(parseDate('2014-09'))
		})
		.attr("x2", function(d){
		  return x(parseDate('2014-09'))
		})
		//.each('end',  function(d){ console.log('fin graph!!');  })
		;

		moverObjeto(container);
		moverObjeto(rect);
	
		labels
		.attr("x", function(d){
		  var pos = x(parseDate('2010-12'))
		  return pos + 20
		})
		.transition()
		.duration(duration*0.8)
		.ease('linear')
		.attr("x", function(d){
		  var pos = x(parseDate('2013-12')) + 20;
		  return pos;
		})
		.each("end", function() {
			d3.select(this)
			.attr("x", function(d) {
				var pos = x(parseDate('2013-12')) - 140;
		  		return pos;
			})
			.transition()
			.duration(duration*0.2)
			.ease('linear')
			.attr("x", function(d) {
				var pos = x(parseDate('2014-09')) - 140;
				return pos;
			});		
		});	

	}

	draw();

	return {
		start: function(){
			//switch
			_startTransition();
		}
	};

};