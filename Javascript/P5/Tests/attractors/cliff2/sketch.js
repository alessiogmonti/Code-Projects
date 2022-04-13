let pointlist = []

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

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');
}

function draw(){
  background(255);

  let dt = 0.1;
  let dx = nx(x,y,a,b,c,d) * dt;
  let dy = ny(x,y,a,b,c,d) * dt;

  x = x + dx;
  y = y + dy;

  pointlist.push(createVector(x,y));

  let col = color(0, 126, 255);
  let str = color(0, 0, 20);

  col.setAlpha(10);
  str.setAlpha(100);

  stroke(str);
  strokeWeight(1);
  fill(col)

  scale(50);

  // beginShape(LINES);
  for (var i = 0; i < pointlist.length; i++) {
    // vertex(pointlist[i].x,pointlist[i].y);
    point(pointlist[i].x, pointlist[i].y)
  }
  // endShape(CLOSE);
}
