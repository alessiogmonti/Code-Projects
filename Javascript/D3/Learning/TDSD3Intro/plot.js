//set svg size
const w = 500;
const h = 500;
const padding = 60;



d3.csv('https://raw.githubusercontent.com/naveenv92/python-science-tutorial/master/intro/Absorbance_Data.csv',
        function (d) {
          return [
            +d['Wavelength'],
            +d['Sample_1_Absorbance'],
            +d['Sample_2_Absorbance']
          ]}).then(plot_data);

function plot_data(data){
  //set axis limits
  const xMin = 400;
  const xMax = 950;
  const yMin = 0;
  const yMax = 2;

  const xScale = d3.scaleLinear()
                   .domain([xMin, xMax])
                   .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
                   .domain([yMin, yMax])
                   .range([h - padding, padding]);

  let data_in_range = [];

  data.forEach(function (e){
    if (e[0] >= xMin && e[0] <= xMax){
      data_in_range.push(e)
    }
  });

  var line = d3.line()
        // .interpolate("basis")
        .x(function(d) {
          return x(d.Wavelength);
        })
        .y(function(d) {
          return y(d.Sample_1_Absorbance);
        });

  const svg = d3.select('#plot_area')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

  svg.append('path')
     .datum(data_in_range)
     .attr('stroke', 'black')
     .attr('stroke-width', 0.9)
     .attr('fill', 'none')
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(0)))
     .transition()
     .duration(700)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));

  svg.selectAll('circle_samp_1')
     .data(data_in_range)
     .enter()
     .append('circle')
     .attr('cx', (d) => xScale(d[0]))
     .attr('cy', (d) => yScale(d[1]))
     .attr('r', 7)
     .attr('fill', 'rgba(0,0,0,0.1)')
     .attr('stroke', 'rgba(0,0,0,0.9)')
     .attr('stroke-width', 1)
     .attr('class', 'points')
     .style('pointer-events', 'all')
     .on("mouseover",function (d){
        var cli = svg.append("text")
           .attr("id", "tooltip")
           .datum(data_in_range)
           .attr("x", (d) => xScale(d[0]))
           .attr("y", (d) => yScale(d[1]))
           .attr('transform', 'translate(90,100)')
           .attr("text-anchor", "middle")
           .attr("font-family", "sans-serif")
           .attr("font-size", "11px")
           .attr("font-weight", "bold")
           .attr("fill", "black")
           // .style("display", null)
           .text(function (d){
              return (
                'Wavelength: ' + d[0] + ' nm' + '\n' + 'Absorbance: ' + d[2]
              );
            });
     })
     .on("mouseout", function(){ cli.style("display", "none");})

  svg.selectAll('circle_samp_2')
     .data(data_in_range)
     .enter()
     .append('circle')
     .attr('cx', (d) => xScale(d[0]))
     .attr('cy', (d) => yScale(d[2]))
     .attr('r', 7)
     .attr('fill', 'rgba(0,0,255,0.1)')
     .attr('stroke', 'rgba(0,0,255,0.9)')
     .attr('stroke-width', 1)
     .attr('class', 'points')
     .style('pointer-events', 'all')
     .append('text')
     .attr('class', 'tooltips')
     .attr('x', xScale(2))
     .attr('y', yScale(1))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '13px')
     .text(function (d){
        return (
          'Wavelength: ' + d[0] + ' nm' + '\n' + 'Absorbance: ' + d[2]
        );
      });


  svg.append('path')
     .datum(data_in_range)
     .attr('stroke', 'steelblue')
     .attr('stroke-width', 0.9)
     .attr('fill', 'none')
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(0)))
     .transition()
     .duration(700)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[2])));

  svg.append('g')
     .style('font-size', '12px')
     .attr('transform', 'translate(0,'+(h-padding)+')')
     .call(d3.axisBottom(xScale));

  svg.append('text')
     .attr('x', w / 2)
     .attr('y', h - 15)
     .attr('text-anchor', 'middle')
     .style('font-family', 'sans-serif')
     .text('Wavelength (nm)');

  svg.append('g')
     .style('font-size', '12px')
     .attr('transform', 'translate(' + padding + ',0)')
     .call(d3.axisLeft(yScale));

  svg.append('text')
     .attr('text-anchor', 'middle')
     .attr('transform', 'translate(15,' + h/2 + ')rotate(-90)')
     .style('font-family', 'sans-serif')
     .text('Absorbance (O.D.)');

  svg.append('path')
     .datum([[835,1.9], [855,1.9]])
     .attr('stroke', 'black')
     .attr('stroke-width', 1)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));
  svg.append('path')
     .datum([[835,1.7], [855,1.7]])
     .attr('stroke', 'steelblue')
     .attr('stroke-width', 1)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));

  svg.append('text')
     .attr('x', xScale(865))
     .attr('y', yScale(1.9))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '13px')
     .text('Sample 1');

  svg.append('text')
     .attr('x', xScale(865))
     .attr('y', yScale(1.7))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '13px')
     .text('Sample 2')

     var focus = svg.append("g")
         .attr("class", "focus")
         .style("display", "none");

     focus.append("circle")
         .attr("r", 4.5);

     focus.append("line")
         .classed("x", true)

     focus.append("line")
         .classed("y", true)

     focus.append("text")
         .attr("x", 9)
         .attr("dy", ".35em");

     svg.append("rect")
         .attr("class", "overlay")
         .attr("width", w)
         .attr("height", h)
         .on("mouseover", (event, function() { focus.style("display", null); }))
         .on("mouseout", (event, function() { focus.style("display", "none"); }))
         .on("mousemove", mousemove);

  function mousemove() {
        var x0 = xScale.invert(d3.pointer(event, this)[0]),
        i = d3.bisect(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0 > d1 - x0 ? d1 : d0;
        console.log(i)
        console.log(x0)
      focus.attr("transform", "translate(" + xScale(d[0]) + "," + yScale(d[1]) + ")");
      focus.select("line.x")
           .attr("x1", 0)
           .attr("x2", -xScale(d[0]))
           .attr("y1", 0)
           .attr("y2", 0)
      focus.select("line.y")
           .attr("x1", 0)
           .attr("x2", 0)
           .attr("y1", 0)
           .attr("y2", h - yScale(d[1]));

      focus.select("text").text(function (d){
         return (
           'Wavelength: ' + d[0] + ' nm' + '\n' + 'Absorbance: ' + d[1]
         );
       });
   }
}
