let scl = 5;
let inc = 0.1;
let cols,rows;
let fr;

let v;

let particles = [];
let flowfield;

let zoff = 0;

function setup(){
  createCanvas(400,400);
  background(255);
  cols = floor(width/scl);
  rows = floor(height/scl);

  flowfield = new Array(cols*rows);

  for (var i = 0; i < 100; i++) {
    particles[i] = new Particle()
  }
}

function draw(){
  let yoff = 0;
  for (var y = 0; y < cols; y++) {
    let xoff = 0;
    for (var x = 0; x < cols; x++) {

      let index = x + y * cols;
      let angle = noise(xoff,yoff, zoff) * TWO_PI * 4;
      v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;

      xoff += inc;
      stroke(0);
      push();
      translate(x*scl, y*scl)
      rotate(v.heading())
      // line(0,0, scl,0)
      pop();
      // rect(x*scl,y*scl, scl,scl);
    }
    yoff += inc;
    zoff += 0.0001;
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }

  // push();
  // fr = floor(frameRate());
  // stroke(0);
  // fill(255);
  // textSize(32);
  // text(fr,5,25);
  // pop();
}
