let population;
let target;
let maxfit;
let bwidth, bheight;
let obstacles;

var lifespan = 350;
var popsize = 35;
var movespeed = 10;

// var speed = 0.25;
// var speedMax = 8;
// var speedMin = 0.25;
// var speedStep = 0.5;

let maxForce = 0.25;
let count = 0;

let generation = 1;
let prevmax = 0;

let img;

let tx, ty;

let sizing = document.getElementById('sketch');
let sw = sizing.offsetWidth; //960
let sh = sizing.offsetHeight; //480

// var gui;

function setup(){
  console.log(sw,sh)
  let canvas = createCanvas(sw, sh);
  canvas.parent('sketch')

  pixelDensity(5.0);
  bwidth = sw - (sw*0.02);
  bheight = sh - (sh*0.02);

  img = loadImage("bird3_06.svg");

  tx = random(sw - (sw*0.2), sw - (sw*0.05));
  ty = random(50, sh - (sh*0.06));
  population = new Population(popsize);
  target = new Target(tx, ty);
  obstacles = new GenObs(20)
  // obstacles.teleporter();

  // gui = createGui("Settings");
  // gui.addGlobals("speed");

  background(252);
}

function draw(){
  population.run();

  count++;

  obstacles.show();
  target.show();

  if (count == lifespan || population.rockets.every(v => v.crashed == true)) {
    count = 0;
    population.evaluate();
    population.selection();
    push();
    fill(color(252,252,252,155));
    stroke(0);
    rect(0,0,sw,sh)
    pop();

    generation ++;
    target.scalar = maxfit/200;

    push();
    fill(250);
    stroke(0);
    strokeWeight(0.3);
    rect(sw*0.01,sh*0.01,sw*0.11,sh*0.08);
    pop();
    text("Iteration: " + generation, sw*0.02,sh*0.04);
    push();
    stroke(0);
    strokeWeight(0.1);
    noFill();
    rect( sw*0.02, sh*0.06, sw*0.08, sh*0.02);
    pop();

    push();
    noStroke();
    if (maxfit < 6400) {
      fill(100,150,222);
    } else {
      fill(25,207,20);
    }
    rect( sw*0.02, sh*0.06, map(floor(maxfit), 0, 3000, 0, sw*0.08, true), sh*0.02);
    pop();
    // text("Max fitness: " + floor(maxfit), sw*0.02,sh*0.07);
  }

  // pg.background(255,0,0);
  // pg.rect(0,0,20,20);
  // pg.fill(20);
  // text("Lifespan: " + count, 10,70);
}

function GenObs(numObs){
  this.obs = [];

  for (let i = 0; i < numObs; i++) {
    obx = random(sw*0.1, bwidth);
    oby = random(sh*0.1, bheight);
    obh = random(sh*0.01,sh*0.1);
    if (obx+(sw*0.01) > tx-target.r && oby+obh < ty+target.r) {
      i--;
    } else {
      this.obs.push(new Obstacle(obx, oby, sw*0.005, obh))
      this.obs.push(new Obstacle(obx+random(sw*0.006,sw*0.01), oby+random(sh*0.005,sh*0.05), sw*0.005, obh+random(sh*0.005,sh*0.05)))
      // this.obs.push(new Obstacle(obx+random(sw*0.006,sw*0.01), oby+random(sh*0.005,sh*0.05), sw*0.005, obh+random(sh*0.005,sh*0.05)))
      // this.obs.push(new Obstacle(obx+random(sw*0.006,sw*0.01), oby+random(sh*0.005,sh*0.05), sw*0.005, obh+random(sh*0.005,sh*0.05)))
      // this.obs.push(new Obstacle(obx+random(sw*0.006,sw*0.01), oby+random(sh*0.005,sh*0.05), sw*0.005, obh+random(sh*0.005,sh*0.05)))
    }
  }

  this.teleporter = function(){
    for( let i = 0; i < numObs; i++){
      if (i % 2 == 0) {
        this.obs[i].entry = true;
        this.obs[i].fill = color(255,100,100);
      }
    }
  }

  this.show = function(){
    push();
    for (let i = 0; i < this.obs.length; i++) {
      noFill()
      stroke(0,0,0,150)
      // stroke(250,100,100,150)
      strokeWeight(0.5)
      rect(this.obs[i].pos.x,this.obs[i].pos.y,this.obs[i].width,this.obs[i].height)

      // push();
      // stroke(0)
      // let next = (i+1)%this.obs.length;
      // line(this.obs[i].pos.x, this.obs[i].pos.y, this.obs[next].pos.x, this.obs[next].pos.y)
      // pop();
    }
    pop();
  }
}

function Obstacle(x,y,w,h){
  this.pos = createVector(x,y);
  this.width = w;
  this.height = h;
  // this.fill = color(250,150,200,50);
  // this.entry = false;
}

function Target(posx,posy){
  this.pos = createVector(posx,posy);
  this.r = sw*0.07;
  this.fill = color(100,150,222,5);
  this.stroke = 255;
  this.theta = 0;
  this.scalar = 5;

  this.show = function(){
    push();
    strokeWeight(0.1)
    stroke(25,207,20)
    fill(this.fill)
    circle(this.pos.x, this.pos.y, this.scalar);
    this.scalar += 0.05;
    // let x = cos(this.theta) * this.scalar;
    // let y = sin(this.theta) * this.scalar;
    // circle(this.pos.x + x,this.pos.y + y, this.scalar);
    // this.theta += 0.1;
    // this.scalar -= 0.2;
    pop();

    push();
    strokeWeight(0.1);
    stroke(1,97,160,250)
    noFill();
    // fill(1,97,160,1);
    circle(this.pos.x, this.pos.y, this.r)
    pop();
  }
}

function DNA(genes){
  if (genes) {
    this.genes = genes;
  } else{
    this.genes = [];

    for (let i = 0; i < lifespan; i++) {
      this.genes[i] = createVector(random(-1,1), random(-1,1));
      this.genes[i].setMag(maxForce);
    }
  }

  this.crossover = function(partner){
    let newDNA = [];
    let mid = floor(random(this.genes.length)); //instead of randomly, choose the section of genes with the highest fitness

    for (let i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newDNA[i] = this.genes[i];
      } else {
        newDNA[i] = partner.genes[i];
      }
    }
    return new DNA(newDNA)
  }

  this.mutation = function(){
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.01) {
        this.genes[i] = createVector(random(-1,1), random(-1,1));
        this.genes[i].setMag(maxForce);
      }
    }
  }
}

function Population(popsize){
  this.rockets = [];
  this.popsize = popsize;
  this.matingPool = [];
  // this.prevPool = [];

  for (let i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function(){
    maxfit = 0;

    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness
        push();
          strokeWeight(1)
          stroke(250,10,10, 50);
          // noFill();
          text(floor(this.rockets[i].fitness), this.rockets[i].pos.x, this.rockets[i].pos.y)
          // circle(this.rockets[i].pos.x, this.rockets[i].pos.y, 5)
        pop();
      }
    }

    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit; //normalizing
    }

    if (maxfit > prevmax) {
      prevmax = maxfit; //this is just for UI value, rockets that don't improve already have same fitness
      this.matingPool = [];
      for (let i = 0; i < this.popsize; i++) {
        let n = this.rockets[i].fitness * 100;
        // n = n < 1 ? 1 : n;
        if ( n > 1){
          for (let j = 0; j < n; j++) {
            this.matingPool.push(this.rockets[i]) // damn
            console.log(this.rockets[i].fitness)
          }
        }
      }
      // return maxfit;
    } else {
      maxfit = prevmax;
      // return maxfit;
    }
  }

  this.selection = function(){
    let newRockets = [];
    for (let i = 0; i < this.rockets.length; i++) {
      let parentA = random(this.matingPool).dna;
      let parentB = random(this.matingPool).dna;

      let child = parentA.crossover(parentB);

      // if (this.rockets[i].mutate) {
      //   val += 0.1;
      // } else {
      //   val = 0.5;
      // }

      child.mutation();
      newRockets[i] = new Rocket(child);
    }
    this.rockets = newRockets;
  }

  this.run = function(){
    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}

function Rocket(dna){
  this.r = 18;

  this.pos = createVector(50, 300);
  this.vel = createVector();
  this.acc = createVector();

  this.count = 0;
  this.complete = false;
  this.crashed = false;

  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;
  this.prevFitness = 0;
  this.mutate = false;

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.calcFitness = function(){
    let d = dist(this.pos.x, this.pos.y, target.pos.x-target.r, target.pos.y-target.r);
    this.fitness = map(d, 0, sw, sw, 0);

    if (this.complete) {
      this.fitness *= 10;
      this.fitness -= (this.count*3);
    }
    if (this.crashed) {
      this.fitness /= 2;
      this.fitness += (this.count/3);
    }

    // if (this.fitness > this.prevFitness) {
    //   this.prevFitness = this.fitness
    // } else {
    //   this.fitness = this.prevFitness
    //   this.mutate = true;
    // }
  }

  this.update = function(){

    let d = dist(this.pos.x,this.pos.y, target.pos.x, target.pos.y);
    if (d < target.r/2) {
      this.complete = true;
      this.pos = target.pos.copy();
    }

    for (let i = 0; i < obstacles.obs.length; i++) {
      if (
        // obstacles.obs[i].entry == false &&
          this.pos.x >= obstacles.obs[i].pos.x - (sw*0.005) &&
          this.pos.x <= obstacles.obs[i].pos.x + (sw*0.005) &&
          this.pos.y >= obstacles.obs[i].pos.y - (sh*0.005) &&
          this.pos.y <= obstacles.obs[i].pos.y + obstacles.obs[i].height + (sh*0.005)) {
        this.crashed = true;
      }
      // } else if (obstacles.obs[i].entry == true &&
      //       this.pos.x >= obstacles.obs[i].pos.x -10 &&
      //       this.pos.x <= obstacles.obs[i].pos.x + 10 &&
      //       this.pos.y >= obstacles.obs[i].pos.y &&
      //       this.pos.y <= obstacles.obs[i].pos.y + obstacles.obs[i].height) {
      //
      //   let next = (i+1)%obstacles.obs.length;
      //   this.pos.x = obstacles.obs[next].pos.x+12;
      //   this.pos.y = obstacles.obs[next].pos.y;
      // }
    }

    if (this.pos.x > bwidth || this.pos.x < (sw*0.01)) {
      this.crashed = true;
    }

    if (this.pos.y > bheight || this.pos.y < (sh*0.01)) {
      this.crashed = true;
    }

    this.applyForce(this.dna.genes[this.count]);
    if (!this.complete && !this.crashed) {
      this.count += 1;
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(movespeed);
    } //bursts of acceleration?
  }

  this.show = function(){
    push();
    strokeWeight(0.1);
    stroke(0,0,0,map(count,0,250,250,0));
    fill(100,222,250,map(count,0,250,250,0));
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    image(img, 0,0, this.r,this.r/2)
    // triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }
}
