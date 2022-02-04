// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman

let nenv;

let seekers = 0;
let evaders = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(205);
  nenv = new NEnv(seekers, evaders)
  nenv.populate();
}

function draw() {
  nenv.run();

  push();
  stroke(10);
  // text(frameRate(), 50,50);
  pop();
}

function keyPressed(){
  push()
  fill(255,200);
  for (var i = 0; i < nenv.prey.length; i++) {
    circle(nenv.prey[i].pos.x,nenv.prey[i].pos.y, 100)
  }
  pop();
  noLoop();
}

class NEnv{
  constructor(amtHunters,amtPrey){
    this.pack = [];
    this.prey = [];

    this.hunters = amtHunters;
    this.runners = amtPrey;
  }

  populate(){
    for (var i = 0; i < this.hunters; i++) {
      this.pack.push(new Seeker(0,0));
    }
    for (var i = 0; i < this.runners; i++) {
      this.prey.push(new Evader(width/2,height/2));
    }
  }

  run(){
    for (let i = 0; i < this.pack.length; i++) {
      this.pack[i].run(this.pack, this.prey);
    }
    for (let i = 0; i < this.prey.length; i++) {
      this.prey[i].run(this.pack, this.prey);
    }
  }
}
