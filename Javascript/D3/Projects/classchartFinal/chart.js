class Chart{
  constructor(opts){
    this.data = opts.data;
    this.element = opts.element;

  }

  draw(){
    // this.width = this.element.offsetWidth;
    this.width = 900;
    this.height = this.width/2.2;
    this.padding = 50;
    this.margin = {
      top : 20,
      bottom : 25,
      left : 60,
      right : 140
    };

    this.element.innerHTML = '';
    const svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    this.plot = svg.append('g')
                   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.createScales();
    this.addAxes();
    this.addLine()
    this.addTtip();
    this.addLabels();
  }
  createScales(){
    this.keynames = d3.scaleOrdinal();

    this.keynames.domain(Object.keys(this.data[0]).filter(key => key!=='date'));

    this.keymap = this.keynames.domain().map(
      keyname => ({
        name: keyname, values: this.data.map(
          d => ({
            date: d.date, key: +d[keyname]})
          )
      })
    );

    const m = this.margin;

    const xExtent = d3.extent(this.data, d => d.date);

    // const yExtent = [0,d3.max(this.keymap, d => d3.max(d.values, function(v){ return v.key }) )];
    const yExtent = [0,1000];


    this.xScale = d3.scaleTime()
                    .range([0, this.width-m.right])
                    .domain(xExtent).nice();

    this.yScale = d3.scaleLinear()
                    .range([this.height-(m.top+m.bottom)-50, 0])
                    .domain(yExtent).nice();

  }

  addAxes(){
    const m = this.margin;

    const xAxis = d3.axisBottom()
                    .scale(this.xScale);

    const yAxis = d3.axisLeft()
                    .scale(this.yScale);

    this.plot.append("g")
             .attr("class", "x axis")
             .attr("transform", `translate(0, ${this.height-(m.top+m.bottom)})`)
             .call(xAxis.ticks(8));

    this.plot.append("g")
             .attr("class", "y axis")
             .call(yAxis.ticks(6))

    this.plot.append("g")
             .append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".71em")
             .style("text-anchor", "end")
             .style("fill", "black")
             .style('font-family', 'Helvetica')
             .style('font-size', '11px')
             .style('letter-spacing', '1px')
             .style('text-transform', 'uppercase')
             .text("$USD");

     this.plot.append("g")
              .append("text")
              // .attr("transform", "rotate(90)")
              .attr("x", this.width-103)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style("fill", "indigo")
              .style('font-family', 'Helvetica')
              .style('font-size', '11px')
              .style('letter-spacing', '1px')
              .style('text-transform', 'uppercase')
              .text("TSLA");

  }

  addLine(){
    const line = d3.line()
    .x(d => this.xScale(d.date))
    .y(d => this.yScale(d.key));

    this.plot.append('g')
             .selectAll('path')
             .data(this.keymap)
             .join('path')
             .classed('stockLines', function(d){
                  if (!d.name.match(/([t])/g)) {
                    return true
                  } else {
                    return false
                  }})
             .attr('d', function (d) { return line(d.values) })
             .style('stroke', function(d){
                  if (d.name.match(/([t])/g)) {
                    return 'indigo'
                  } else {
                    return 'orange'
                  }})
             .style("stroke-dasharray", function(d){
               if (d.name.match(/[m]/g)){
                 return "3, 3"
             }})
             .style('fill', 'none');



  }

  addTtip(){
    let mouseG = this.plot.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // the vertical line
      .attr("class", "mouse-line")
      .style("stroke", "rgba(50,50,50,1)")
      .style("stroke-width", "0.5px")
      .style("opacity", "0");

    let lines = document.getElementsByClassName('stockLines');

    let mousePerLine = mouseG.selectAll('.mouse-line')
      .data(this.keymap)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", "orange")
      .style("fill", "orange")
      .style("fill-opacity", "0.3")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(-60, -20)")
      .style("text-shadow",
      " -2px -2px 0 #FFF, 0   -2px 0 #FFF, 2px -2px 0 #FFF, 2px  0   0 #FFF, 2px  2px 0 #FFF, 0    2px 0 #FFF,-2px  2px 0 #FFF,-2px  0   0 #FFF");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', this.width-145) // can't catch mouse events on a g element
      .attr('height', this.height)
      .attr('x', '0')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', () => { // mouse moving over canvas
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
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {break;}
              if (pos.x > mouse[0]){ end = target;}
              else if (pos.x < mouse[0]){beginning = target;}
              else break; }
            d3.selectAll(".mouse-per-line").select("text")
              // .text(function(){ const formatTime = d3.timeFormat("%b %d");
              //   return formatTime(xScale.invert(pos.x)) + " $" + yScale.invert(pos.y).toFixed(1)});
              .text( function(d) {
                return "$" + d.values[idx].key.toFixed(2);
                // return "$"+this.yScale.invert(pos.y).toFixed(2) + d.name
              })

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
                  .attr("class", "stock");

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
                 .style("fill", "orange")
                 .style('font-family', 'Helvetica')
                 .style('font-size', '11px')
                 .style('letter-spacing', '1px')
                 .style('text-transform', 'uppercase')
                 .text(function(d){
                   if(d.name.match(/[_]/g)){
                     return d.name;
                   } else if (d.name.match(/[m]/g)){
                     return d.name;
                   }
                        // if (d.name.match(/(band)\W+/g)){
                        //   console.log('true')
                        //   return d.name;
                        // }
                        // if (d.name.match(/(tsla)\W+/g)){
                        //   return d.name;
                        // }
                      });
    //
    // let col = this.plot.selectAll('.special')
    //                    .style('stroke',this.color || 'red')
    //                    .style('stroke-dasharray', ("3,3"))
    //                    .lower();

  }

  setColors(color){
    this.color = color;
  }

  setData(data){
    this.data = data;
    this.draw();
  }
}
