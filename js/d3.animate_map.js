d3.animate_map = function(containerId, stations) {

	var margin = {top: 20, right: 20, bottom: 30, left: 10},
	    width = 1080 - margin.left - margin.right,
	    height = 780 - margin.top - margin.bottom;

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

	var nested_listado = d3.nest()
		.key(function(d) { 
			return d.Fecha.split('-')[0]; 
		})
		.map(stations,d3.map);

    var scale = d3.geo.mercator().scale(333000).center([-58.381667, -34.603722]).translate([width / 2 + 144 , height / 2 - 48]);

    var projection = scale,
		path = d3.geo.path().projection(scale);

	var yValue = 20,
		label_gap = 20;

    function draw(){

	   	svg.append("image")
		    .attr("xlink:href", "img/1080.png")
		    .attr("width", 1080)
		    .attr("height", 1080)
		    .attr("transform", function(d) {
				return "translate(0,-150)";
			});

		var estaciones = svg
			.append("g")
			.attr("class", "estaciones");

		var estacionesLabel = svg
			.append("g")
			.attr("class", "estaciones-txt");

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
			.attr("r",10);

		nested_listado.forEach(function(ix1,el1){
			estacionesLabel
				.append('text')
				.text(ix1)
				.attr('class','label-anio disabled')
				.attr('x',10)
				.attr('y',yValue)
				.attr("id", ix1);
			
			yValue += label_gap;

			el1.forEach(function(el2,ix2){
				estacionesLabel
					.append('text')
					.text(el2.estacion)
					.attr('class','label-estacion disabled label-estacion-'+el2.id)
					.attr('x',20)
					.attr('y',yValue)
					.attr("id", 'label-estacion-'+el2.id.trim());

				yValue += label_gap;	
			});

			yValue += 10;
		});

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
					.attr("r",100)
					.transition()
					.attr("r",10);

					var labelObj = svg.select('.label-estacion-'+d.id.trim());
					labelObj.classed('label-estacion label-estacion-'+d.id.trim());

				});
			}
		},
		clear: function(){
			var all = svg.selectAll('circle.estacion');
		    all.attr("r",0);

			//$('.label-estacion').addClass('disabled');

		}
	};

};