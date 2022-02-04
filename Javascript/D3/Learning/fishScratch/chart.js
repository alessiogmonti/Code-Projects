class Chart{
  constructor(opts){
    this.data = opts.data;
    this.element = opts.element;

  }

  draw(){
    this.width = this.element.offsetWidth;
    this.height = this.width/2.2;
    this.padding = 50;
    this.margin = {
      top : 20,
      bottom : 20,
      left : 60,
      right : 140
    };

    this.element.innerHTML = '';
    const svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    this.plot = svg.append('g')
                   .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // this.createScales();
    // this.addAxes();
    // this.addLine();
    // this.addTtip();
    // this.addLabels();
    this.makeFish(this.data[1].children);
  }

  makeFish(d){
    function enableFisheye(d) {
      d.enabled = true;

      var that = this,
          link = that.parentNode,
          div = link.parentNode,
          touchtime;

      var normalWidth = width / d.size,
          image = new Image,
          imageWidth = 105,
          imageHeight = 225,
          desiredDistortion = 0,
          desiredFocus,
          progress = 0,
          idle = true;

      var x = fisheye()
          .distortion(0)
          .extent([0, width]);

      var annotation = d3.select(div).selectAll("li");

      image.src = "http://graphics8.nytimes.com/newsgraphics/2013/09/13/fashion-week-editors-picks/assets/thumbs-" + pixelRatio + "/" + d.slug + ".jpg";
      image.onload = initialize;

      d3.timer(function() {
        if (progress < 0) return true;
        var context = d.context;
        context.clearRect(0, 0, width, 2);
        context.fillStyle = "#777";
        context.fillRect(0, 0, ++progress, 2);
      });

      d.resize = function() {
        var f = x.focus() / x.extent()[1],
            d1 = imageWidth / normalWidth - 1,
            d0 = x.distortion() / d1;
        normalWidth = width / d.size;
        x.distortion(d0 * d1).extent([0, width]).focus(f * width);
        render();
      };

      function initialize() {
        progress = -1;

        d3.select(that)
            .on("mousedown", mousedown)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            .on("touchstart", touchstart)
            .on("touchmove", mousemove)
            .on("touchend", mouseout);

        render();
      }

      function render() {
        annotation
            .style("left", function(d) { return Math.round(x(d.range[0] * normalWidth)) - 4 + "px"; })
            .style("width", function(d) { return Math.round(x((d.range[d.range.length - 1] + 1) * normalWidth)) - Math.round(x(d.range[0] * normalWidth)) - 1 + "px"; })
          .select(".annotation")
            .style("left", function(d) { return Math.min(0, (width - 90) - (x(d.range[0] * normalWidth) - 4)) + "px"; });

        var context = d.context;
        context.clearRect(0, 0, width, height);

        for (var i = 0, n = d.size; i < n; ++i) {
          var x0 = x(i * normalWidth),
              x1 = x((i + 1) * normalWidth),
              dx = Math.min(imageWidth, x1 - x0);
          context.drawImage(image, Math.round((i * imageWidth + (imageWidth - dx) / 2) * pixelRatio), 0, dx * pixelRatio, imageHeight * pixelRatio, x0, 0, dx, height);
          context.beginPath();
          context.moveTo(x0, 0);
          context.lineTo(x0, height);
          context.stroke();
        }

        context.strokeRect(0, 0, width, height);
      }

      function move() {
        if (idle) d3.timer(function() {
          var currentDistortion = x.distortion(),
              currentFocus = currentDistortion ? x.focus() : desiredFocus;
          idle = Math.abs(desiredDistortion - currentDistortion) < .01 && Math.abs(desiredFocus - currentFocus) < .5;
          x.distortion(idle ? desiredDistortion : currentDistortion + (desiredDistortion - currentDistortion) * .14);
          x.focus(idle ? desiredFocus : currentFocus + (desiredFocus - currentFocus) * .14);
          render();
          return idle;
        });
      }

      function mouseover() {
        desiredDistortion = imageWidth / normalWidth - 1;
        mousemove();
      }

      function mouseout() {
        desiredDistortion = 0;
        mousemove();
      }

      function mousemove() {
        desiredFocus = Math.max(0, Math.min(width - 1e-6, d3.mouse(that)[0]));
        move();
      }

      function mousedown() {
        var m = Math.max(0, Math.min(width - 1e-6, d3.mouse(that)[0]));
        for (var i = 0, n = d.size; i < n && x(i * normalWidth) < m; ++i);
        link.href = "http://www.nytimes.com/fashion/runway/" + d.slug + "/spring-2014-rtw/" + i + "?fingerprint=true";
      }

      function touchstart() {
        d3.event.preventDefault();
        mouseover();
        if (d3.event.touches.length === 1) {
          var now = Date.now();
          if (now - touchtime < 500) mousedown(), link.click();
          touchtime = now;
        }
      }
    }

    function fisheye() {
      var min = 0,
          max = 1,
          distortion = 3,
          focus = 0;

      function G(x) {
        return (distortion + 1) * x / (distortion * x + 1);
      }

      function fisheye(x) {
        var Dmax_x = (x < focus ? min : max) - focus,
            Dnorm_x = x - focus;
        return G(Dnorm_x / Dmax_x) * Dmax_x + focus;
      }

      fisheye.extent = function(_) {
        if (!arguments.length) return [min, max];
        min = +_[0], max = +_[1];
        return fisheye;
      };

      fisheye.distortion = function(_) {
        if (!arguments.length) return distortion;
        distortion = +_;
        return fisheye;
      };

      fisheye.focus = function(_) {
        if (!arguments.length) return focus;
        focus = +_;
        return fisheye;
      };

      return fisheye;
    }

  }

  setColors(color){
    this.color = color;
  }

  setData(data){
    this.data = data;

    this.draw();
  }

}
