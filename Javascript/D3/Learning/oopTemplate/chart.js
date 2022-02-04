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
  }

  setColors(color){
    this.color = color;
  }

  setData(data){
    this.data = data;

    this.draw();
  }

}
