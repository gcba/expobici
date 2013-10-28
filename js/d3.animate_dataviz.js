d3.animate_dataviz = function(containerId, stations, data) {

	var margin = {top: 20, right: 20, bottom: 30, left: 10},
	    width = 1080 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y-%m").parse;
	var parseDateEstaciones = d3.time.format("%Y-%d-%m").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .ticks(4)
	    .orient("right");

	var line = d3.svg.line()
	    .x(function(d) { return x(d.anioMes); })
	    .y(function(d) { return y(d.Record_Count); })
	    .interpolate("basis");

	var svg = d3.select("#"+containerId).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var setupEstacion;

	stations.forEach(function(d) {
		d.fecha = d.fecha.split(" ")[0];
		d.fecha = parseDateEstaciones(d.fecha);
	});

	setupEstacion = stations;

	data.forEach(function(d) {
      d.anioMes = parseDate(d.anioMes);
      d.Record_Count = +d.Record_Count;
    });

	var timeline;

    function draw(){

	    x.domain(d3.extent(data, function(d) { return d.anioMes; }));
	    y.domain(d3.extent(data, function(d) { return d.Record_Count; }));

	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    svg.append("path")
	        .datum(data)
	        .attr("class", "line")
	        .attr("d", line);

	    svg.selectAll("line.estacion")
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
			.attr("y2",height);

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

	}

	draw();

	return {
		play: function(){
			timeline
			.transition()
			.duration(20000)
			.ease('linear')
			.attr("x1", function(d){
			  return x(parseDate('2013-09'))
			})
			.attr("x2", function(d){
			  return x(parseDate('2013-09'))
			});
		}
	};

};