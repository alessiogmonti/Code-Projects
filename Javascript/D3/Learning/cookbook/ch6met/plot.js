var id = 0,
    data = [],
    duration = 500,
    chartHeight = 100,
    chartWidth = 680,
    w = 600,
    h = 600;

for (var i = 0; i < 20; i++) {
  push(data)
}

function render(data){
  var selection = d3.select("body")
                    .selectAll("div.v-bar")
                    .data(data, function(d){return d.id;});

  selection.enter()
           .append("div")
           .attr("class", "v-bar")
           .attr('width', w)
           .attr('height', h)
           .style("margin-left", "100px")
           .style("margin-top", "100px")
           .style("position", "fixed")
           .style("top", chartHeight + "px")
           .style("left", function(d, i){
              return barLeft(i+5) + "px";
           })
           .style("height", "0px")
           .append("span")

  const c = d3.hsl("steelblue");

  selection.transition()
           .duration(duration)
           .style("top", function(d){
              return chartHeight - barHeight(d)+ "px";
           })
           .style("left", function(d, i){
              return barLeft(i) + "px";
           })
           .style("height", function(d){
              return barHeight(d) + "px";
           })
           .style("background-color", function(d){
              return "rgba(20,13,215," + (0.01*d.value) + ")"
           })
           .select("span")
           .text(function(d){return d.value});

  selection.exit()
           .transition()
           .duration(duration)
           .style("left", function(d, i){
              return barLeft(-1) + "px";
           })
           .remove();
}

function push(data){
  data.push({
    id: ++id,
    value: Math.round(Math.random() * chartHeight)
  });
}

function barLeft(i){
   return i * (30 + 5);
}

function barHeight(d){
  return d.value;
}

setInterval(function() {
  data.shift();
  push(data);
  render(data);
}, 2000);

render(data);

d3.select("#graph")
  .append("div")
  .attr("class", "baseline")
  .style("position", "fixed")
  .style("top", chartHeight + "px")
  .style("left", "0px")
  .style("width", chartWidth + "px");
