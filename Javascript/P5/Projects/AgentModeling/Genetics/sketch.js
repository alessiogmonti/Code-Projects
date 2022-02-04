// to solve: rotation collision -- is fitness set at the end? -- are genes a set of vectors?
//-- fitness for best distance at count per iteration

var population;
var lifespan = 400;
var target;
var maxForce = 1;

var count = 0;

var rx = 200;
var ry = 300;
var rW = 300;
var rH = 10;

var r = 255
var g = 255
var b = 255

var c;

var maxfit;
var prevmax = 0;

function setup(){
  createCanvas(800,700);
  addScreenPositionFunction();
  population = new Population();

  target = createVector(400, 34);

  c = color(r,g,b);
  background(222);

}

function draw(){

  population.run();

  // lifeP.html(count);

  count++;
  if (count == lifespan) {
    population.evaluate();
    population.selection();
    count = 0;
  }

  push();
  fill(0)
  textSize(22);
  text(floor(maxfit), 20, 40)
  pop();

  push();
  fill(c);
  // rectMode(CENTER);
  rect(rx, ry, rW, rH);
  pop();

  fill(240);
  ellipse(target.x,target.y, 50)
}

function DNA(genes){
  if (genes) {
    this.genes = genes;
  } else{
    this.genes = [];

    for (var i = 0; i < lifespan; i++) {
      this.genes[i] = createVector(random(-1,1), random(-1,1));
      this.genes[i].setMag(maxForce);
    }
  }

  this.crossover = function(partner){
    var newDNA = [];
    var mid = floor(random(this.genes.length)); //instead of randomly, choose the section of genes with the highest fitness

    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newDNA[i] = this.genes[i];
      } else {
        newDNA[i] = partner.genes[i];
      }
    }
    return new DNA(newDNA)
  }

  this.mutation = function(){
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.01) {
        this.genes[i] = createVector(random(-1,1), random(-1,1));
        this.genes[i].setMag(maxForce);
      }
    }
  }
}

function Population(){
  this.rockets = [];
  this.popsize = 80;
  this.matingPool = [];
  this.prevPool = [];

  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function(){
    maxfit = 0;

    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness
      }
    }

    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit; //normalizing
    }

    if (maxfit > prevmax) {
      prevmax = maxfit;
      this.matingPool = [];
      for (var i = 0; i < this.popsize; i++) {
        var n = this.rockets[i].fitness * 100;
        for (var j = 0; j < n; j++) {
          this.matingPool.push(this.rockets[i]) // damn
        }
      }
      return maxfit;
    } else return prevmax;
  }

  this.selection = function(){
    var newRockets = [];
    for (var i = 0; i < this.rockets.length; i++) {
      var parentA = random(this.matingPool).dna;
      var parentB = random(this.matingPool).dna;

      var child = parentA.crossover(parentB);
      child.mutation();
      newRockets[i] = new Rocket(child);
    }
    this.rockets = newRockets;
  }

  this.run = function(){
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}

function Rocket(dna){
  this.r = 5;

  this.pos = createVector(400, 680);
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

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.calcFitness = function(){
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, 800, 800, 0);

    if (this.complete) {
      this.fitness *= 10;
      this.fitness -= (this.count*3);
    }
    if (this.crashed) {
      this.fitness /= 10;

    }
  }

  this.update = function(){
    var screenpos = screenPosition(this.pos.x,this.pos.y);
    var d = dist(screenpos.x,screenpos.y, target.x, target.y);
    if (d < 40) {
      this.complete = true;
      this.pos = target.copy();
    }

    if (screenpos.x >= rx && screenpos.x <= rx + rW && screenpos.y >= ry && screenpos.y <= ry + rH) {
      this.crashed = true;
      g = 0;
      b = 0;
    }

    if (this.pos.x > width || this.pos.x < 0) {
      this.crashed = true;
    }

    if (this.pos.y > height || this.pos.y < -5) {
      this.crashed = true;
    }

    this.applyForce(this.dna.genes[count]);
    // count++;
    if (!this.complete && !this.crashed) {
      this.count += 1;
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(4);
    } //bursts of acceleration?
  }

  this.show = function(){
    push();
    stroke(100,150,222);
    fill(100,222,150,0+(count*10));
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }
}
