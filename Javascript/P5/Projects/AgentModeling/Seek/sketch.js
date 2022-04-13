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
let evaders = 20;

let timer = 5;
let pausetoggle = false;

var gui;
var trails = false;

let sizing = document.getElementById('sketch');
let sw = sizing.offsetWidth;
let sh = sizing.offsetHeight;

let strokeweight = 0.4;

function setup() {
  let canvas = createCanvas(sw, sh);
  canvas.parent('sketch')

  pixelDensity(4.0);
  nenv = new NEnv(seekers, evaders)
  nenv.populate();
  gui = createGui('Settings')
  gui.addGlobals('trails')
  background(250);
}

function draw() {
  if (trails) {
    push();
    fill(255);
    rect(0,0,sw,sh)
    pop();
    text(floor(frameRate()), 10,10);
  }

  nenv.run();
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

function windowResized() {
  resizeCanvas(sw, sh);
}

class NEnv{
  constructor(packsize,preysize){
    this.pack = [];
    this.prey = [];

    this.packlen = packsize;
    this.preylen = preysize;

    this.signaler = false;

    this.theta = 20;
    this.scalar = 11;
    this.escape = createVector(random(50,sw-50),random(50,sh-50));;
    this.escapeR = 25;
    this.switch = false;
  }

  populate(){
    for (var i = 0; i < this.packlen; i++) {
      this.pack.push(new Seeker(0,0,i));
    }
    for (var i = 0; i < this.preylen; i++) {
      this.prey.push(new Evader(width/2,height/2));
    }
  }

  escapes(){
    push();
     stroke(255,200)
     fill(97,175,239);
     let x = cos(this.theta) * this.scalar;
     let y = sin(this.theta) * this.scalar;
     circle(this.escape.x + x,this.escape.y + y, 5);

     if (this.theta < 10){
       this.switch = true
     } else if (this.theta > 30) {
       this.switch = false
     }

     if (this.switch) {
       this.theta += 0.1
       this.scalar += 0.1
     } else {
       this.theta -= 0.1
       this.scalar -= 0.1
     }
    pop();
  }

  run(){
    for (let i = 0; i < this.prey.length; i++) {
      this.prey[i].run();

      push();
      fill(100,255,154);
      stroke(20,20,20,255);
      strokeWeight(strokeweight);
      rect(this.prey[i].pos.x, this.prey[i].pos.y+10, this.prey[i].hp*10, 3);
      pop();

      if (!this.prey[i].signaler && !this.prey[i].escapeP && !this.prey[i].hunted && dist(this.prey[i].pos.x, this.prey[i].pos.y, this.escape.x, this.escape.y) < this.prey[i].r+(this.escapeR/2)) {
        this.prey[i].signaler = true;
      }

      if (this.prey[i].signaler) {
        this.prey[i].escapeP = this.escape.copy();
        if (!this.prey[i].hunted) {
          this.prey[i].signal(this.prey);
        }
      }

      if (this.prey[i].escapeP && !this.prey[i].signaling && dist(this.prey[i].pos.x, this.prey[i].pos.y, this.escape.x, this.escape.y) < this.prey[i].r+(this.escapeR/2)) {
        this.prey[i].escaped = true;
        this.prey.splice(i,1);
        break;
      }

      if (this.prey[i].hp < 0) {
        this.pack[this.prey[i].killer].frenzy();
        this.prey.splice(i,1);
      }
    }
    this.escapes();

    for (let i = 0; i < this.pack.length; i++) {
      this.pack[i].run(this.pack, this.prey);
    }
  }
}
