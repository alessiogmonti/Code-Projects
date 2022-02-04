// xn+1 = sin(a yn) + c cos(a xn)
// yn+1 = sin(b xn) + d cos(b yn)

let x = 9.1;
let y = 11;

let a = -1.4;
let b = 1.6;
let c = 1;
let d = 0.7;

let pointlist = []

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');
  // noLoop();
}

function draw(){
  background(255);

  for (var i = 0; i < 2000; i++) {


  let dt = 1.35;
  let dx = sin( ( a * y ) ) + c * cos( ( a * x ) ) *dt;
  let dy = sin( ( b * x ) ) + d * cos( ( b * y ) ) *dt;

  x = x+dx;
  y = y+dy;

  pointlist.push(createVector(x,y));
  // console.log(x,y);

  let c1 = color(0, 126, 255);
  let b1 = color(0, 0, 20);

  c1.setAlpha(10);
  b1.setAlpha(100);

  stroke(b1);
  strokeWeight(1);
  fill(c1);

  scale(5);

  beginShape(LINES);
  for (var i = 0; i < pointlist.length; i++) {
    vertex(pointlist[i].x,pointlist[i].y);
    // console.log(pointlist[i]);
  }
  endShape(CLOSE);
  }
}
