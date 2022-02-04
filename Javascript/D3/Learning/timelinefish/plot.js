//Defining the trips
var myTrips = [{
  "day": 1,
  "post": 101,
  "title": "First day"
}, {
  "day": 2,
  "post": 102,
  "title": "Second day"
}, {
  "day": 3,
  "post": 103,
  "title": "Third day"
}, {
  "day": 5,
  "post": 103,
  "title": "Third day"
}, {
  "day": 12,
  "post": 103,
  "title": "Third day"
}, {
  "day": 13,
  "post": 103,
  "title": "Third day"
}, {
  "day": 15,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 17,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 18,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 22,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 24,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 25,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 30,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 31,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 32,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 33,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 34,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 36,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 37,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 38,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 39,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 45,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 46,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 47,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 50,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 55,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 56,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 58,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 59,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 60,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 62,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 64,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 65,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 78,
  "post": 104,
  "title": "Forth day"
}, {
  "day": 79,
  "post": 104,
  "title": "Forth day"
}];

function x(d) {
  return d.day;
}

var collection_array = d3.values(myTrips);
maximum = d3.max(collection_array, function(d) {
  return d.day
});

var maxnum = 80;
var margin = {
    top: 0,
    right: 15,
    bottom: 0,
    left: 15
  },
  width = 615,
  height = 40,
  radius = 8;

var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, maximum + 1]).range([0, width]);

var tooltip = d3.select("#infobox")
  .append("div")
  .attr("class", "infocontent")
  .style("z-index", "10")
  .style("visibility", "hidden");

var xAxis = d3.svg.axis().orient("bottom").scale(xScale).tickFormat(d3.format(",d")).tickSize(-height);
var svg = d3.select("#timeline").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)

.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height);

//Add the x-axis.
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

var dot = svg.append("g")
  .attr("class", "dots")
  .selectAll(".dot")
  .data(myTrips)
  .enter().append("circle")
  .attr("class", "dot")
  .style("fill", "green")
  .attr("r", function(d) {
    d.r
  })
  .call(position)

.on("mouseover", function(d) {

    d3.select(this).style("fill", "red");
    return tooltip.style("visibility", "visible").text('Day ' + d.day + ' - ' + d.title);

  })
  .on("mouseout", function() {
    d3.select(this).style("fill", "green");

    return tooltip.style("visibility", "hidden");
  });

// Add a title.
dot.append("title")
  .text(function(d) {
    return d.title;
  });

// Positions the dots based on data.
function position(dot) {

  dot.attr("cx", function(d) {

      return xScale(x(d));
    })
    .attr("cy", height / 2)
    .attr("r", radius);
}

svg.on("mousemove", function() {

    var mouse = d3.mouse(this);
    xScale.distortion(5).focus(mouse[0]);
    dot.call(position);

    svg.select(".x.axis").call(xAxis);
  })
  .on("mouseout", function() {

    var mouse = d3.mouse(this);
    xScale.distortion(0).focus(mouse[0]);
    dot.call(position);
    svg.select(".x.axis").call(xAxis);
  });

var totalRows = 80;
