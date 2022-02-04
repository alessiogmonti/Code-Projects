data = [10,20,30,40,50,60,70,80,90]

const w = 500;
const h = 500;


const svg = d3.select('#plot_area')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

      svg.append('text')
         .data(data)
         .enter()
         .append('p')
         .text(function(d){
                  return d})
