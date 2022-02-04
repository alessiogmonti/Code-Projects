class Chart{
  constructor(opts){
    this.data = opts.data;
    this.element = opts.element;

  }

  draw(){
    this.width = this.element.offsetWidth;
    this.height = this.width/2.2;
    this.padding = 50;
    this.margin = {
      top : 20,
      bottom : 20,
      left : 60,
      right : 140
    };

    this.element.innerHTML = '';
    const svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    this.plot = svg.append('g')
                   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    console.log(this.data[1].children);

    this.makeFish();
    // this.createScales();
    // this.addAxes();
    // this.addLine();
    // this.addTtip();
    // this.addLabels();
  }

  makeFish(){
    this.plot.on('mousemove', (event) => {
              let x = event.x-20;
              d3.selectAll('.content').attr('x', (d, i) =>  fisheye(d, x))
            })
             .on('mouseleave', () => {
              d3.selectAll('.content').transition().attr('x', (d,i) => this.xScale(i))
            });

    var chart = this.plot.append('g')
     	.classed('group', true)

    // this.plot.append("g").append("svg:image").data(this.data[1].children)
    // .attr("xlink:href", d => { console.log(d); return "data/"+d. }  )
    // .attr("width", this.width).attr("height",800);

    this.plot.append("g").append("rect").attr("width",this.width).attr("height",800).style("fill","black")


    this.xScale = d3.scaleBand().domain(d3.range(10)).range([0,this.width]).padding(0)

    let rects = this.plot.selectAll('content')
     	                   .data(this.data[1].children)

    this.plot.selectAll("content").data()

    rects.exit().remove();

    // rects.enter()
    //  		 .append("rect")
    //  		 .attr("class","content")
    //  		 .attr("y", 0)
    //  		 .attr("x", (d, i) => this.xScale(i))
    //  		 .attr("width", "3px")
    //  		 .style("opacity",1)
    //  		 .attr("stroke","white")
    //  		 .style('fill', 'rgb(81, 170, 232)')
    //  		 .attr("height", 800);
  rects.enter().append("svg:image")
        .attr("class", "content")
        .attr("xlink:href",  function(d) {console.log(d); return "data/"+d.img;})
        .attr("x", (d, i) => this.xScale(i))
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)

    let distortion = 50;

    let fisheye = (_, a) => {
      let x = this.xScale(_),
          left = x < a,
          range = d3.extent(this.xScale.range()),
          min = range[0],
          max = range[1],
          m = left ? a - min : max - a;
      if (m === 0) m = max - min;
        return (left ? -1 : 1) * m * (distortion + 1) / (distortion + (m / Math.abs(x - a))) + a;
    }
  }

  setColors(color){
    this.color = color;
  }

  setData(data){
    this.data = data;

    this.draw();
  }

}
