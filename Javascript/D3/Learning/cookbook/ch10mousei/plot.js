var r = 400;

var svg = d3.select("body")
            .append("svg");

var positionLabel = svg.append("text")
                       .attr("x", 10)
                       .attr("y", 30);

svg.on("mousemove", function(){
   printPosition();
});

function printPosition(){
    var position = d3.pointer(event, svg.node().this);
    positionLabel.text(position);
}

function positionLabel(){
  svg.on("click", function(){
    for (var i = 0; i < 5; i++) {
     var position = d3.pointer(event, svg.node());

     var circle = svg.append("circle")
                     .attr("cx", position[0])
                     .attr("cy", position[1])
                     .attr("r", 0)
                     .style("stroke-width", 5/(i))
                     .transition()
                       .delay(Math.pow(i, 2.5) * 50)
                       .duration(2000)
                       .ease("quad-in")
                     .attr("r", r)
                     .style("stroke-opacity", 1)
                     .each("end", function(){
                        d3.select(this).remove();
                     });
    }
  });
}
