//f(x,y)=(a-x)^{2}+b(y-x^{2})^{2}

let x = 1;
let y = 1;
let b = 100;
let a = 1;

let pointlist = [];

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');
}

function draw(){
  background(255);
  // orbitControl();

  let dt = 0.01;
  let dx = ( ( a - x ) **2 + b * ( y - ( x**2 ) ) **2 ) * dt;
  let dy = ( ( a - x ) **2 + b * ( y - ( x**2 ) ) **2 ) * dt;

  x = x + dx;
  y = y + dy;

  pointlist.push(createVector(x,y));

  let c1 = color(0, 126, 255);
  let b1 = color(0, 0, 20);

  c1.setAlpha(10);
  b1.setAlpha(100);

  stroke(b1);
  strokeWeight(1);
  fill(c1)

  scale(4);

  beginShape(LINES);
  for (var i = 0; i < pointlist.length; i++) {
    vertex(pointlist[i].x,pointlist[i].y);
  }
  endShape(CLOSE);
}
