var margin = {top: 5, bottom: 5, left: 40, right: 40};
var padding = 50;
var w = 750;
var h = 450;

var read_data = d3.csv('atdata.csv', function(d){
  function removeNaN(e,c){
    if(e>0){return e}else{return c}
  }
  return {date : d3.timeParse("%Y-%m-%d")(d.Date), aapl: d.AAPL,
          aapl_sma: removeNaN(+d.SMA_AAPL,d.AAPL), tsla: d.TSLA,
          tsla_sma: removeNaN(+d.SMA_TSLA,d.TSLA), uband: removeNaN(+d.UpperBand, d.TSLA),
          lband: removeNaN(+d.LowerBand,d.TSLA)} //mband: removeNaN(+d.MiddleBand,d.TSLA),
}).then(plot_data);

function plot_data(data){

var keep = ['tsla']
var filterdata = data.filter(function(d){
  return
})

var sortData = data.forEach((item, i) => {
  return { date: item.date, tsla: item.tsla, tsla_sma: item.tsla_sma, uband: item.uband,
    lband: item.lband }
});

    var x = d3.scaleTime()
      .range([padding, w]);

    var y = d3.scaleLinear()
      .range([h-100, padding]);

    var color = d3.scaleOrdinal().range(['#157145','rgba(0,0,0,0.5)','#F58A07','rgba(0,0,0,0.5)', 'rgba(255,0,0,0.3)','rgba(255,0,0,0.3)']);

    var xAxis = d3.axisBottom()
      .scale(x);

    var yAxis = d3.axisLeft()
      .scale(y);

    var line = d3.line()
      .x(function(d) {
        console.log(x)
        return x(d.date);
      })
      .y(function(d) {
        return y(d.transform);
      });

    var svg = d3.select("#graph").append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(Object.keys(data[0]).filter(function(key) {
      return key !== "date";
    }));

    var transforms = color.domain().map(function(type) {
      return {
        name: type,
        values: data.map(function(d) {
          return {
            date: d.date,
            transform: +d[type]
          };
        })
      };
    });

    console.log(transforms)

  // var textlabels = d3.scaleOrdinal();

  // textlabels.domain(Object.keys(data[0]).filter(function(key){
      // return key.match(/\btsla\b/g), console.log(key.match(/\btsla\b/g));
    // }));

    // var tlabel = textlabels.domain().map(function(name){
    //   return{
    //     name: name,
    //     values: data.map(function(d){
    //       return{
    //         date: d.date,
    //         stock: d[name]
    //       }
    //     })
    //   }
    // });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    })).nice();

    y.domain([
      d3.min(transforms, function(c) {
        return d3.min(c.values, function(v) {
          return v.transform;
        });
      }),
      d3.max(transforms, function(c) {
        return d3.max(c.values, function(v) {
          return v.transform;
        });
      })
    ]).nice();

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h-padding) + ")")
      .call(xAxis.ticks(8));

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.ticks(4))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("$USD");

    var stock = svg.selectAll(".transform")
      .data(transforms)
      .enter().append("g")
      .attr("class", "transform");

    stock.append("path")
      .attr('fill', 'none')
      .attr("class", "line")
      .attr("d", function(d) {
        return line(d.values);
      })
      .style("stroke", function(d) {
        return color(d.name);
      });

    stock.append("text")
      .datum(transforms.filter(function(d){
        return d.name.match(/\btsla\b/g)
      }))
      .attr("transform", function(d) {
        var temp = d[d.length-1]
        return "translate(" + x(temp.values.date) + "," + y(temp.values.transform) + ")";
      })
      .attr("x", 5)
      .attr("dy", ".55em")
      .text(function(d) {
        return d.name;
      }).style("fill", "#F58A07");

    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(transforms)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return color(d.name);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', w) // can't catch mouse events on a g element
      .attr('height', h)
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
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);

            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));

            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
}
