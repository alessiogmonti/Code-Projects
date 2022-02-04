class Chart{
  constructor(opts){
    this.data = opts.data;
    this.element = opts.element;

    this.draw();
  }

  draw(){
    this.width = this.element.offsetWidth;
    this.height = this.width/2;
    this.margin = {
      top : 20,
      bottom : 20,
      left : 30,
      right : 50
    };

    this.element.innerHTML = '';
    const svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    this.plot = svg.append('g')
                   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.createScales();
    this.addAxes();
    this.addLine();
    this.addToolTip();
    this.addLabels();
  }

  createScales(){
    const m = this.margin;

    const xExtent = d3.extent(this.data, d => d[0]);
    // const yExtent = d3.extent(this.data, d => d[1]);
    // if (yExtent[0] > 0) { yExtent[0] = 0;};

    const yExtent = [0,d3.max(this.data, function(d) { return Math.max(d[1]); })];

    this.xScale = d3.scaleTime()
                    .range([0, this.width-m.right])
                    .domain(xExtent).nice();

    this.yScale = d3.scaleLinear()
                    .range([this.height-(m.top+m.bottom), 0])
                    .domain(yExtent).nice();
  }

  addAxes(){
    const m = this.margin;

    const xAxis = d3.axisBottom()
                    .scale(this.xScale)
                    .ticks(8);

    const yAxis = d3.axisLeft()
                    .scale(this.yScale)
                    .ticks(4);

    this.plot.append("g")
             .attr("class", "x axis")
             .attr("transform", `translate(0, ${this.height-(m.top+m.bottom)})`)
             .call(xAxis);

    this.plot.append("g")
             .attr("class", "y axis")
             .call(yAxis)
  }

  addLine(){
    const line = d3.line()
                   .x(d => this.xScale(d[0]))
                   .y(d => this.yScale(d[1]));

    this.plot.append('path')
             .datum(this.data)
             .classed('line', true)
             .attr('d', line)
             .style('stroke', 'red')
             .style('fill', 'none');
  }

  addToolTip(){
    let mouseG = this.plot.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // the vertical line
      .attr("class", "mouse-line")
      .style("stroke", "rgba(50,50,50,1)")
      .style("stroke-width", "0.5px")
      .style("opacity", "0");

    let lines = document.getElementsByClassName('line');

    let mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", "black"
    )
      .style("fill", "rgba(0,0,0,0.5)"
    )
      .style("fill-opacity", "0.3")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.join("text")

    mouseG.append('svg:rect')
      .attr('width', this.width-145)
      .attr('height', this.height)
      .attr('x', '0')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() {
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', () => {
        let mouse = d3.pointer(event);
        d3.select(".mouse-line")
          .attr("d", () => {
            let d = "M" + mouse[0] + "," + this.height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", (d, i) => {
            let xDate = this.xScale.invert(mouse[0]),
                bisect = d3.bisector(d => d.date).right,
                idx = bisect(d.values, xDate);

            let beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
            while (true){
                  target = Math.floor((beginning + end) / 2);
                var  pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0]){
                end = target;
              }
              else if (pos.x < mouse[0]){
                beginning = target;
              }
              else break;
            }
            d3.select(event.currentTarget).select("text")
              .text( () => { "$" + this.yScale.invert(pos.y).toFixed(2)})
            return "translate(" + mouse[0] + "," + pos.y +")";
          })
          .style('font-family', 'Helvetica')
          .style('font-size', '11px')
          .style('letter-spacing', '1px')
          .style('text-transform', 'uppercase');
        });
  }

  addLabels(){
    let sec = this.plot.selectAll(".line")
                  .data(this.keymap)
                  .enter().append("g")
                  .attr("class", "linelabel");

              sec.append("text")
                 .datum(d => ({
                     name: d.name,
                     value: d.values[d.values.length-1]
                   }))
                 .attr("transform", d => "translate(" + this.xScale(d.value.date)
                                                      + "," + this.yScale(d.value.key)
                                                      + ")")
                 .attr("x", 7)
                 .attr("dy", ".3em")
                 .style("fill", "green")
                 .style('font-family', 'Helvetica')
                 .style('font-size', '11px')
                 .style('letter-spacing', '1px')
                 .style('text-transform', 'uppercase')
                 .text(function(d){
                          return d.name});

    let col = this.plot.selectAll('.special')
                       .style('stroke','red')
                       .style('stroke-dasharray', ("3,3"))
                       .lower();
  }

  setData(newData){
    this.data = newData;
    this.draw();
  }
}
