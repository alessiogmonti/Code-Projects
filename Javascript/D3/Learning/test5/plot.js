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

  const svg = d3.select('#graph')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

  svg.append('path')
     .datum(data_in_range)
     .attr('stroke', '#F58A07')
     .attr('stroke-width', 1.3)
     .attr('fill', 'none')
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(0)))
     .transition()
     .duration(700)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));

  svg.append('path')
     .datum(data_in_range)
     .attr('stroke', '#157145')
     .attr('stroke-width', 1.3)
     .attr('fill', 'none')
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(0)))
     .transition()
     .duration(700)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[2])));

  var ttip = d3.select('Body')
               .append('div')
               // .attr('class', 'tooltip')
               .style("position", "absolute")
               .style("z-index", "10").style("opacity", 0.8)
               .style("visibility", "hidden");

  function m_over(data){
    ttip.datum(data)
        .style("visibility","visible")
        .html(function(d){
          return "<p class='tooltip'>" + 'Wavelength: ' + d[0] + "<br>Absorbance: "+ d[1] + "</p>"
        }).transition().delay(0.1).style("opacity", 1);

        // .text(function(d){
        //       return ("Wavelength: " + d[0] +", Sample_1_Absorbance: " + d[1])
        //       })
  }

  function m_out(data){
    ttip.style("visibility","hidden").style("opacity", 0);
  }

  function m_move(data){
    ttip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
  }


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
     .on("mouseover",function (event,d){
        return m_over(d)
     })
     .on("mousemove", function (event, d) {
        return m_move(d)
     })
     .on("mouseout", function (event, d) {
        return m_out(d)
     })
     .on("click", function () {
        console.log(this);
     });

  svg.selectAll('circle_samp_2')
    .data(data_in_range)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d[0]))
    .attr('cy', (d) => yScale(d[2]))
    .attr('r', 7)
    .attr('fill', 'rgba(0,0,0,0.1)')
    .attr('stroke', 'rgba(0,0,0,0.9)')
    .attr('stroke-width', 1)
    .attr('class', 'points')
    .style('pointer-events', 'all')
    .on("mouseover",function (event,d){
       return m_over(d)
    })
    .on("mousemove", function (event, d) {
       return m_move(d)
    })
    .on("mouseout", function (event, d) {
       return m_out(d)
    })
    .on("click", function () {
       console.log(this);
    });

  //Labels & Axis

  svg.append('g')
     .attr('class', 'xline 1')
     .style('font-size', '12px')
     .style('stroke-width', '2px')
     .attr('transform', 'translate(0,'+(h-padding)+')')
     .call(d3.axisBottom(xScale));

  svg.append('text')
     .attr('x', w / 2)
     .attr('y', h - 15)
     .attr('text-anchor', 'middle')
     .style('font-family', 'sans-serif')
     .style('fill', 'rgba(50,50,50,1)')
     .text('Wavelength (nm)');

  svg.append('g')
     .attr('class', 'xline 2')
     .style('font-size', '12px')
     .style('stroke-width', '2px')
     .attr('transform', 'translate(' + padding + ',0)')
     .call(d3.axisLeft(yScale));

  svg.append('text')
     .attr('text-anchor', 'middle')
     .attr('transform', 'translate(15,' + h/2 + ')rotate(-90)')
     .style('font-family', 'sans-serif')
     .style('fill', 'rgba(50,50,50,1)')
     .text('Absorbance (O.D.)');

  svg.append('path')
     .datum([[835,1.9], [855,1.9]])
     .attr('stroke', '#157145')
     .attr('stroke-width', 4)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));
  svg.append('path')
     .datum([[835,1.7], [855,1.7]])
     .attr('stroke', '#F58A07')
     .attr('stroke-width', 4)
     .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));

  svg.append('text')
     .attr('x', xScale(865))
     .attr('y', yScale(1.9))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '13px')
     .style('fill', 'rgba(50,50,50,1)')
     .text('Sample 1');

  svg.append('text')
     .attr('x', xScale(865))
     .attr('y', yScale(1.7))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '13px')
     .style('fill', 'rgba(50,50,50,1)')
     .text('Sample 2')
}
