let x = 0.1;
let y = 0.2;
let z = 1;

let sigma = 10;
let rho = 28;
let beta = 8.0/3.0;

let pointlist = []

let circx;
let circy;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');
}

function draw(){
  background(255);

  let dt = 0.01;
  let dx = (sigma * (y - x)) * dt;
  let dy = (x * (rho - z) - y) * dt;
  let dz = (x * y - beta * z) * dt;

  x = x + dx;
  y = y + dy;
  z = z + dz;

  pointlist.push(createVector(x,y,z));

  let c = color(0, 66, 205);
  let b = color(20, 20,20);

  c.setAlpha(20);
  b.setAlpha(250);

  stroke(b);
  strokeWeight(1);
  // fill(c)
  noFill();

  scale(4);


  beginShape(LINE_STRIP);
  for (var i = 0; i < pointlist.length; i++) {
    vertex(pointlist[i].x,pointlist[i].y,pointlist[i].z);
    rotateY(frameCount*0.00001);
  }
  endShape(CLOSE);
}

function keyPressed() {
  if (key == 'x') {
    noLoop();
  }
}
