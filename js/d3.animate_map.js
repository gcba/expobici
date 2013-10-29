d3.animate_map = function(containerId, stations) {

	var margin = {top: 20, right: 20, bottom: 30, left: 10},
	    width = 1080 - margin.left - margin.right,
	    height = 350 - margin.top - margin.bottom;

	var parseDateEstaciones = d3.time.format("%Y-%d-%m").parse,
		parseDateUpdate = d3.time.format("%Y/%m/%d").parse;

	var svg = d3.select("#"+containerId).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	stations.forEach(function(d) {
		d.Fecha = d.Fecha.split(" ")[0];
		//d.Fecha = parseDateEstaciones(d.fecha);
	});

	var nested_data = d3.nest()
		.key(function(d) { return d.Fecha; })
		.rollup(function(d) { return d; })
		.map(stations,d3.map);

    function draw(){

    	console.log('draw');

	}

	draw();

	return {
		update: function(day){
			var d = day.replace(/\//g,'-');
			var st = nested_data.get(d);
			if(st){
				console.log(d);
				console.log(st);
			}
			//draw points of this day
		},
		clear: function(){
			//clear points
		}
	};

};