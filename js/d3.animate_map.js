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

	var iconSize = 40;

    function draw(){

	   	svg.append("image")
		    .attr("xlink:href", "img/1080i.png")
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
			.selectAll('image.estacion')
			.data(stations)
			.enter()
			.append("image")
		    .attr("xlink:href", "img/bici.svg")
		    .attr("width", 0)
		    .attr("height", 0)
   		    .attr("opacity", 0)
		    .attr("class", function(d){
				return "estacion estacion-"+d.id;
			})
		    .attr("transform", function(d) {
		    	var p = projection([d.clong,d.clat]);
				return "translate(" + (p[0]-iconSize/2) + ',' + (p[1]-iconSize/2) + ")";
			});

		nested_listado.forEach(function(ix1,el1){
			estacionesLabel
				.append('text')
				.text(ix1)
				.attr('class','label-anio disabled label-anio-'+ix1)
				.attr('x',10)
				.attr('y',yValue)
				.attr("id", 'label-anio-'+ix1);
			
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
			var d = day.replace(/\//g,'-'),
				anio = d.split('-')[0];

			svg.select('.label-anio-'+anio)
				.classed('disabled', false);

			var st = nested_data.get(d);
			if(st){
				st.forEach(function(d){
					svg.select('.estacion-'+d.id)
						.transition()
						.attr("opacity",.5)
						.attr("width",iconSize*2)
						.attr("height",iconSize*2)
						.transition()
						.attr("opacity",1)
						.attr("width",iconSize)
						.attr("height",iconSize);

					svg.select('.label-estacion-'+d.id.trim())
						.classed('disabled', false);

				});
			}
		},
		clear: function(){
			svg.selectAll('image.estacion').attr("opacity",0).attr("width",0).attr("height",0);
			svg.selectAll('text.label-estacion').classed("disabled",true);
			svg.selectAll('text.label-anio').classed("disabled",true);
		}
	};

};