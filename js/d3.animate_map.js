d3.animate_map = function(containerId, stations) {

	var margin = {top: 20, right: 20, bottom: 30, left: 10},
	    width = 1080 - margin.left - margin.right,
	    height = 1080 - margin.top - margin.bottom;

	var parseDateEstaciones = d3.time.format("%Y-%d-%m").parse,
		parseDateUpdate = d3.time.format("%Y/%m/%d").parse;

	var svg = d3.select("#"+containerId).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);

	stations.forEach(function(d) {
		d.Fecha = d.Fecha.split(" ")[0];
	});

	var nested_data = d3.nest()
		.key(function(d) { return d.Fecha; })
		.map(stations,d3.map);

    var scale = d3.geo.mercator().scale(340000).center([-58.381667, -34.603722]).translate([width / 2 + 145 , height / 2 - 50]);

    var projection = scale,
		path = d3.geo.path().projection(scale);

    function draw(){

	   	svg.append("image")
		    .attr("xlink:href", "img/1080.png")
		    .attr("width", 1080)
		    .attr("height", 1080);

		var estaciones = svg
			.append("g")
			.attr("class", "estaciones");

		var circulos = estaciones
			.selectAll('circle.estacion')
			.data(stations)
			.enter()
			.append("circle")
			.attr("id", function(d){
				return d.id;
			})
			.attr("class", function(d){
				return "estacion estacion-"+d.id;
			})
			.attr("transform", function(d) {
				return "translate(" + projection([d.clong,d.clat]) + ")";
			})
			.attr('stroke-width',3)
			.attr("r",5);
	}

	draw();

	return {
		update: function(day){
			var d = day.replace(/\//g,'-');
			var st = nested_data.get(d);
			if(st){
				st.forEach(function(d){
					var nuevo = svg.select('.estacion-'+d.id);
					nuevo
					.transition()
					.attr("r",10);
				});
			}
		},
		clear: function(){
			var all = svg.selectAll('circle.estacion');

		      all.attr("r",0);
		}
	};

};