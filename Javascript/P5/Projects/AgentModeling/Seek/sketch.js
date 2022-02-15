// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman


//give evader regen
//give seeker eat
//create about with unshift.jp text example github - can't unrandomize characters at the moment.
//create contact page
//photoshop images to size for portfolio grid
//create gallery for tesla stock with grasshopper and multiple photoshopped together.
//adjust font size.
// and that's it! For now! in the future I'll make my website look more like GE innovation barometer and animate ML algoritms.
// my p5 sketches will be ported over to threejs.

let nenv;
let width = 1400;
let height = 700;

let seekers = 4;
let evaders = 40;

let timer = 5;
let pausetoggle = false;

function setup() {
  createCanvas(width, height);
  nenv = new NEnv(seekers, evaders)
  nenv.populate();
  background(250);
}

function draw() {
  nenv.run();
  nenv.kill();
}

function keyPressed(){
  pausetoggle = !pausetoggle;

  if (pausetoggle) {
    push()
    fill(255,200);
    for (var i = 0; i < nenv.prey.length; i++) {
      circle(nenv.prey[i].pos.x,nenv.prey[i].pos.y, 35)
    }
    pop();
    noLoop();
  } else {
    loop();
  }
}

class NEnv{
  constructor(packsize,preysize){
    this.pack = [];
    this.prey = [];

    this.packlen = packsize;
    this.preylen = preysize;
  }

  populate(){
    for (var i = 0; i < this.packlen; i++) {
      this.pack.push(new Seeker(0,0,i));
    }
    for (var i = 0; i < this.preylen; i++) {
      this.prey.push(new Evader(width/2,height/2));
    }
  }

  kill(){
    for (var i = 0; i < this.prey.length; i++) {
      if (this.prey[i].hp < 0) {
        this.pack[this.prey[i].killer].frenzy();
        this.prey.splice(i,1);
      }
    }
  }

  run(){
    for (let i = 0; i < this.prey.length; i++) {
      this.prey[i].run(this.pack, this.prey);
      push();
      fill(100,255,154);
      stroke(20,20,20,255);
      strokeWeight(0.5);
      rect(this.prey[i].pos.x, this.prey[i].pos.y+10, this.prey[i].hp*10, 3);
      pop();
    }
    for (let i = 0; i < this.pack.length; i++) {
      this.pack[i].run(this.pack, this.prey);
    }
  }
}
