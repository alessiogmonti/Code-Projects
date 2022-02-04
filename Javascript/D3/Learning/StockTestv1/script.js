var margin = {top: 5, right: 80, bottom: 5, left: 80},
    w = 750;
    h = 450;
    padding = 50;

var readData = d3.csv('stockdataToPlot.csv', function(d){
  function removeNaN(e,c){
    if(e>0){return e}else{return c}
  }
  return {date : d3.timeParse("%Y-%m-%d")(d.Date), aapl : d.AAPL,
          aapl_sma: removeNaN(+d.SMA_AAPL,d.AAPL), tsla : d.TSLA, tsla_sma: removeNaN(+d.SMA_TSLA,d.TSLA)}
}).then(plot_data);

function plot_data(data){
  // var knames = d3.scale.category10();
  var knames = d3.scaleOrdinal();

  var accent = d3.scaleOrdinal(d3.schemeAccent);
  accent.domain(Object.keys(data[0]).filter(function(key){
    return !key.match(/([_])|(d)\w+/g)
  })).range(['#157145','#F58A07']); //'#F58A07','#157145'

  knames.domain(Object.keys(data[0]).filter(function(key){
    return !key.match(/([_])|(d)\w+/g)
  }));

  var kvals = knames.domain().map(function(name){
    return {
      name: name,
      values: data.map(function(d){
        return {
          date: d.date,
          stock: d[name]
        };
      })
    };
  });

  var xScale = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; })).nice()
    .range([padding, w-35]);


  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return Math.max(d.aapl, d.tsla); })+118])
    .range([h-100,padding]);

  var svg = d3.select('#graph')
              .append('svg')
              .attr('width', w+30)
              .attr('height', h);

              svg.append('path')
                 .datum(data)
                 .attr('stroke', 'black')
                 .attr('stroke-width', 0.9)
                 .style("stroke-dasharray", ("3, 3"))
                 .attr('fill', 'none')
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(0)))
                 .transition()
                 .duration(700)
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(d.aapl_sma)));

              svg.append('path')
                 .datum(data)
                 .attr('class', 'stock aapl')
                 .attr('stroke', '#157145')
                 .attr('stroke-width', 0.9)
                 .attr('fill', 'none')
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(0)))
                 .transition()
                 .duration(700)
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(d.aapl)));

              svg.append('path')
                 .datum(data)
                 .attr('stroke', 'black')
                 .attr('stroke-width', 0.9)
                 .style("stroke-dasharray", ("3, 3"))
                 .attr('fill', 'none')
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(0)))
                 .transition()
                 .duration(700)
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(d.tsla_sma)));

              svg.append('path')
                 .datum(data)
                 .attr('class', 'stock tsla')
                 .attr('stroke', '#F58A07')
                 .attr('stroke-width', 0.9)
                 .attr('fill', 'none')
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(0)))
                 .transition()
                 .duration(700)
                 .attr('d', d3.line()
                              .x((d) => xScale(d.date))
                              .y((d) => yScale(d.tsla)));

      var sec = svg.selectAll("stock")
                  .data(kvals)
                  .enter().append("g")
                  .attr("class", "stock");

                sec.append("text")
                   .datum(function(d){
                     return {
                       name: d.name,
                       value: d.values[d.values.length-1]
                     };
                   })
                   .attr("transform", function(d){
                     return "translate(" + xScale(d.value.date) + "," + yScale(d.value.stock) +")"
                   })
                   .attr("x", 7)
                   .attr("dy", ".3em")
                   .style("fill", function(d) {
                     return accent(d.name);
                   })
                   .style('font-family', 'Helvetica')
                   .style('font-size', '11px')
                   .style('letter-spacing', '1px')
                   .style('text-transform', 'uppercase')
                   .text(function(d){
                     return d.name;
                   });


  // var ttip = d3.select('Body')
  //              .append('div')
  //              .style("position", "absolute")
  //              .style("z-index", "10").style("opacity", 0.8)
  //              .style("visibility", "hidden");
  //
  // function m_out(data){
  //   ttip.style("visibility","hidden").style("opacity", 0);
  // }
  //
  // function m_move(data){
  //   ttip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
  // }
  //
  // svg.selectAll('.saapl')
  //    .data(data)
  //    .enter()
  //    .append('circle')
  //    .attr('cx', (d) => xScale(d.date))
  //    .attr('cy', (d) => yScale(d.aapl))
  //    .attr('r', 6)
  //    .attr('fill', '#157145')
  //    .attr('fill-opacity', '0.3')
  //    .attr('stroke', 'rgba(0,0,0,0.9)')
  //    .attr('stroke-width', 0.5)
  //    .attr('class', 'points')
  //    .style('pointer-events', 'all')
  //    .on("mouseover",function (event,data){
  //      ttip.datum(data)
  //          .style("visibility","visible")
  //          .html(function(d){
  //            const formatTime = d3.timeFormat("%b %d");
  //            return "<p class='tooltip'>" + formatTime(d.date) + "<br> $"+ parseFloat(d.aapl).toFixed(2)+ "</p>"
  //          }).transition().delay(0.1).style("opacity", 1);
  //    })
  //    .on("mousemove", function (event, d) {
  //       return m_move(d)
  //    })
  //    .on("mouseout", function (event, d) {
  //       return m_out(d)
  //    })
  //    .on("click", function () {
  //       console.log(this);
  //    });
  //
  // svg.selectAll('.tsla')
  //   .data(data)
  //   .enter()
  //   .append('circle')
  //   .attr('cx', (d) => xScale(d.date))
  //   .attr('cy', (d) => yScale(d.tsla))
  //   .attr('r', 6)
  //   .attr('fill', '#F58A07')
  //   .attr('fill-opacity', '0.3')
  //   .attr('stroke', 'rgba(0,0,0,0.9)')
  //   .attr('stroke-width', 0.5)
  //   .attr('class', 'points')
  //   .style('pointer-events', 'all')
  //   .on("mouseover",function (event,data){
  //     ttip.datum(data)
  //         .style("visibility","visible")
  //         .html(function(d){
  //           const formatTime = d3.timeFormat("%b %d");
  //           return "<p class='tooltip'>" +formatTime(d.date) + "<br> $"+ parseFloat(d.tsla).toFixed(2) + "</p>"
  //         }).transition().delay(0.1).style("opacity", 1);    })
  //   .on("mousemove", function (event, d) {
  //      return m_move(d)
  //   })
  //   .on("mouseout", function (event, d) {
  //      return m_out(d)
  //   })
  //   .on("click", function () {
  //      console.log(this);
  //   });

//Labels & Axis
  svg.append('g')
     .attr('class', 'xline 1')
     .style('font-size', '11px')
     .style('font-family', 'Helvetica')
     .style('stroke-width', '1px')
     .attr('transform', 'translate(0,'+(h-padding)+')')
     .call(d3.axisBottom(xScale).ticks(8));

  svg.append('g')
     .attr('class', 'xline 2')
     .style('font-size', '11px')
     .style('font-family', 'Helvetica')
     .style('stroke-width', '1px')
     .attr('transform', 'translate(' + padding + ',0)')
     .call(d3.axisLeft(yScale).ticks(4));

  svg.append('text')
     .attr('text-anchor', 'middle')
     .attr('transform', 'translate(30,35)')
     .style('font-family', 'Helvetica')
     .style('font-size', '11px')
     .style('fill', 'rgba(50,50,50,1)')
     .style('letter-spacing', '1px')
     .style('text-transform', 'uppercase')
     .text('$USD');

  var smaLabel = svg.append('text')
     .attr('class', 'sma')
     .style('font-size', '11px')
     .style('font-family', 'Helvetica')
     .style('stroke-width', '1px')
     .attr('transform', 'translate(710,35)')
     .style('fill', 'rgba(50,50,50,1)')
     .style('letter-spacing', '1px')
     .text('SMA30');

  // var lin1 = d3.select('sma').enter().append('g');
  //
  //       lin1.append('path')
  //       .datum([[10,10], [50,200]])
  //       .attr('stroke', 'black')
  //       .attr('stroke-width', 1)
  //       .attr('d', d3.line()
  //                    .x((d) => xScale(d[0]))
  //                    .y((d) => yScale(d[1])));
  //                    console.log(smaLabel)

  //mouse interactions here onwards

  var mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // the black vertical line
    .attr("class", "mouse-line")
    .style("stroke", "rgba(50,50,50,1)")
    .style("stroke-width", "0.5px")
    .style("opacity", "0");

  var lines = document.getElementsByClassName('stock');

  var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(kvals)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return accent(d.name);
    })
    .style("fill", function(d) {
      return accent(d.name);
    })
    .style("fill-opacity", "0.3")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text")
    .attr("transform", function(d){
      if (d.name == 'aapl') {
        return "translate(-50,30)"
      } else {
        return "translate(-50, -30)"
      }
    }).style("text-shadow",
    " -2px -2px 0 #FFF, 0   -2px 0 #FFF, 2px -2px 0 #FFF, 2px  0   0 #FFF, 2px  2px 0 #FFF, 0    2px 0 #FFF,-2px  2px 0 #FFF,-2px  0   0 #FFF");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', w-87) // can't catch mouse events on a g element
    .attr('height', h)
    .attr('x', '50')
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
    .on('mousemove', function() { // mouse moving over canvas
      var mouse = d3.pointer(event, this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + h;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          var xDate = xScale.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.date; }).right;
              idx = bisect(d.values, xDate);

          var beginning = 0,
              end = lines[i].getTotalLength();
              target = null;
          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0]){
              end = target;
            }
            else if (pos.x < mouse[0]){
              beginning = target;
            }
            else break; //position found
          }

          d3.select(this).select('text')
            // .text(function(){ const formatTime = d3.timeFormat("%b %d");
            //   return formatTime(xScale.invert(pos.x)) + " $" + yScale.invert(pos.y).toFixed(1)});
            .text(function(){return "$" + yScale.invert(pos.y).toFixed(2)})
          return "translate(" + mouse[0] + "," + pos.y +")";
        })
        .style('font-family', 'Helvetica')
        .style('font-size', '11px')
        .style('letter-spacing', '1px')
        .style('text-transform', 'uppercase');
      });
}

var gs = d3.graphScroll()
    .container(d3.select('#container'))
    .graph(d3.selectAll('.container #graph'))
    .eventId('uniqueId1')  // namespace for scroll and resize events
    .sections(d3.selectAll('.container #sections > div'))
    // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
    .on('active', function(i){
      // var pos = [ {cx: width - r, cy: r},
      //             {cx: r,         cy: r},
      //             {cx: width - r, cy: height - r},
      //             {cx: width/2,   cy: height/2} ][i]
      //
      // circle.transition().duration(1000)
      //     .attrs(pos)
      //   .transition()
      //     .style('fill', colors[i])
    });
