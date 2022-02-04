var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		wid = w.innerWidth || e.clientWidth || g.clientWidth,
		wid = 500
		y = w.innerHeight|| e.clientHeight|| g.clientHeight;


		// Feel free to change or delete any of the code you see in this editor!
    var svg = d3.select("body").append("svg")
      .attr("width", wid)
      .attr("height", "200")
	  .on('mousemove', () => {
            let x = event.x - 20;
            d3.selectAll('.content').attr('x', (d, i) =>  fisheye(d, x))
          })
		.on('mouseleave', () => {
			d3.selectAll('.content').transition().attr('x',function(d,i){return xScale(i)})
        })

   var chart = svg.append('g')
    	.classed('group', true)


	svg.append("g").append("rect").attr("width",wid).attr("height",200).style("fill","black")


    let xScale = d3.scaleBand().domain(d3.range(27)).range([0,wid]).padding(0)

   let rects = svg.selectAll('content')
    	.data(d3.range(27))

  rects.exit().remove();

    rects.enter()
		.append("rect")
		.attr("class","content")
		.attr("y", 0)
		.attr("x", (d, i) => xScale(i))
		.attr("width", "100px")
		.style("opacity",1)
		.attr("stroke","white")
		.style('fill', 'rgb(81, 170, 232)')
		.attr("height", 200);

    let distortion = 5;

    function fisheye(_, a) {

      let x = xScale(_),
          left = x < a,
          range = d3.extent(xScale.range()),
          min = range[0],
          max = range[1],
          m = left ? a - min : max - a;
      if (m === 0) m = max - min;
      return (left ? -1 : 1) * m * (distortion + 1) / (distortion + (m / Math.abs(x - a))) + a;
    }
