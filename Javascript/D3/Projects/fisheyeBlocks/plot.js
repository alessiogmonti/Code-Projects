var data = ['data/aidG.jpg', 'data/flight.jpg', 'data/helmet.jpg', 'data/swan.jpg', 'data/ultra.jpg'];


var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		width = 1300,
    y = 600;

    var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", "600")
	  .on('mousemove', () => {
            let x = event.x;
            d3.selectAll('.content')
						.attr('x', (d,i) => fisheye(d,x))
          })
		.on('mouseleave', () => {
			d3.selectAll('.content').transition()
			.attr('x', (d,i) => xScale(d,i))
		});

  var chart = svg.append('g')
    	.classed('group', true)

  let xScale = d3.scaleBand().domain(data).range([0,width])

  let rects = svg.selectAll('content')
    						 .data(
									 // d3.range(5)
									 data
								 )

  rects.exit().remove();

    rects.enter()
		.append("svg:image")
		.attr("xlink:href", d => d)
		.attr("class", "content")
		.attr("y", 0)
		.attr("x", (d, i) => xScale(d,i))
		.attr("width", (d,i) => xScale(800,i))
		.style("opacity", 1)
		.attr("stroke", "black")
		.style('fill', 'rgb(81, 170, 232)')
		.attr("height", "600px");

    let distortion = 4;

    function fisheye(_, a) {
      let x = xScale(_),
          left = x < a,
          range = d3.extent(xScale.range()),
          min = range[0],
          max = range[1],
          m = left ? a - min : max - a;
      if (m === 0) m = max - min;
      return (left ? -1 : 1) * m * (distortion + 1) / (distortion + (m / Math.abs(x - a)))+a;
    }
