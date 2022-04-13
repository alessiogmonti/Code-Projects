let population;
let target;
let maxfit;
let bwidth, bheight;
let obstacles;

var lifespan = 150;
var popsize = 50;
var speed = 20;

let maxForce = 3;
let count = 0;

let generation = 1;
let prevmax = 0;

let img;

let tx, ty;

let pg;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  pg = createGraphics(100, 100);

  pixelDensity(5.0);
  bwidth = window.innerWidth-20;
  bheight = window.innerHeight-20;

  img = loadImage("bird 2.svg");

  tx = random(window.innerWidth-200,window.innerWidth-50);
  ty = random(50, window.innerHeight-50);
  population = new Population(popsize);
  target = new Target(tx, ty);
  obstacles = new GenObs(15)
  // obstacles.teleporter();

  background(248);
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
    fill(color(248,248,248,125));
    stroke(0);
    rect(0,0,window.innerWidth,window.innerHeight)
    pop();

    generation ++;
    target.scalar = maxfit/200;

    push();
    fill(250);
    stroke(0);
    strokeWeight(0.3);
    rect(2,2,123,75);
    pop();
    text("Generation: " + generation, 10,20);
    text("Max fitness: " + floor(maxfit), 10,45);
  }

  pg.background(255,0,0);
  pg.rect(0,0,20,20);
  pg.fill(20);
  text("Lifespan: " + count, 10,70);
}

function GenObs(numObs){
  this.obs = [];

  for (let i = 0; i < numObs; i++) {
    obx = random(70, bwidth);
    oby = random(20, bheight);
    obh = random(20,250);
    if (obx+2 == tx || oby+obh == ty) {
      i--;
    } else {
      this.obs.push(new Obstacle(obx, oby, 2, obh))
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
      stroke(250,100,100,150)
      strokeWeight(1)
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
  this.r = 80;
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
    this.scalar += 0.1;
    // let x = cos(this.theta) * this.scalar;
    // let y = sin(this.theta) * this.scalar;
    // circle(this.pos.x + x,this.pos.y + y, this.scalar);
    // this.theta += 0.1;
    // this.scalar -= 0.2;
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
  this.prevPool = [];

  for (let i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function(){
    maxfit = 0;

    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness
      }
    }

    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit; //normalizing
    }

    if (maxfit > prevmax) {
      prevmax = maxfit;
      this.matingPool = [];
      for (let i = 0; i < this.popsize; i++) {
        let n = this.rockets[i].fitness * 100;
        n = n < 1 ? 1 : n;
        for (let j = 0; j < n; j++) {
          this.matingPool.push(this.rockets[i]) // damn
        }
      }
      return maxfit;
    } else {
      maxfit = prevmax;
      return maxfit;
    }
  }

  this.selection = function(){
    let newRockets = [];
    for (let i = 0; i < this.rockets.length; i++) {
      let parentA = random(this.matingPool).dna;
      let parentB = random(this.matingPool).dna;

      let child = parentA.crossover(parentB);
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
  this.r = 17;

  this.pos = createVector(50, 300);
  this.vel = createVector();
  this.acc = createVector();

  this.count = 0;
  this.complete = false;
  this.crashed = false;

  this.alpha = 0;
  this.timealive = 0;

  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;
  this.prevFitness = 0;

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.calcFitness = function(){
    let d = dist(this.pos.x, this.pos.y, target.pos.x-target.r, target.pos.y-target.r);
    this.fitness = map(d, 0, window.innerWidth, window.innerWidth, 0);

    if (this.complete) {
      this.fitness *= 10;
      this.fitness -= (this.count*50);
    }
    if (this.crashed) {
      this.fitness /= 2;
      this.fitness += this.timealive;
    }

    if (this.fitness > this.prevFitness) {
      this.prevFitness = this.fitness
    } else {
      this.fitness = this.prevFitness
    }
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
          this.pos.x >= obstacles.obs[i].pos.x -10 &&
          this.pos.x <= obstacles.obs[i].pos.x + 10 &&
          this.pos.y >= obstacles.obs[i].pos.y &&
          this.pos.y <= obstacles.obs[i].pos.y + obstacles.obs[i].height) {
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

    if (this.pos.x > bwidth || this.pos.x < 10) {
      this.crashed = true;
    }

    if (this.pos.y > bheight || this.pos.y < 10) {
      this.crashed = true;
    }

    this.applyForce(this.dna.genes[this.count]);
    if (!this.complete && !this.crashed) {
      this.count += 1;
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(speed);
      this.timealive += 1;
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
