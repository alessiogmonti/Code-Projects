// xn+1 = sin(a yn) + c cos(a xn)
// yn+1 = sin(b xn) + d cos(b yn)

var x = 1;
var y = 1;

var a = -1.4;
var b = 1.6;
var c = 1;
var d = 0.7;

function nx(x, y, a, b, c, d){
  var nxval = (sin( ( a * y ) )) + (c * cos( ( a * x ) ));
  return nxval;
}

function ny(x, y, a, b, c, d){
  var nyval = (sin( ( b * x ) )) + (d * cos( ( b * y ) ));
  return nyval;
}

function genpoints(iters){
  var dt = 0.01;
  var x1 = [];
  var y1 = [];

  x1.length = iters;
  y1.length = iters;

  x1[0] = 1;
  y1[0] = 1;

  for (var i = 0; i < iters-1; i++) {
    x1[i+1] = x1[i] + nx(x,y,a,b,c,d) * dt;
    console.log(x1[i+1]);
    y1[i+1] = y1[i] + ny(x,y,a,b,c,d) * dt;
  }

  return [x1,y1];
}

function drawpoints(){
  pt2draw = genpoints(10000);
  beginShape(LINES);
  for (var i = 0; i < pt2draw[0].length; i++) {
    vertex(pt2draw[0][i],pt2draw[1][i]);
    // console.log(pt2draw[0][i]);
  }
  endShape(CLOSE);
}


function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');

  background(255);

  let c1 = color(0, 126, 255);
  let b1 = color(0, 0, 20);

  c1.setAlpha(10);
  b1.setAlpha(100);

  stroke(b1);
  strokeWeight(1);
  fill(c1);

  scale(5);

  drawpoints();
}

function draw(){
}
