let population;
let target;
let maxfit;
let bwidth, bheight;
let obstacles;

let lifespan = 200;
let popsize = 10;

let generation = 1;
let prevmax = 0;

let tx, ty;

let newGen;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(5.0);

  bwidth = window.innerWidth-20;
  bheight = window.innerHeight-20;
  tx = random(window.innerWidth-200,window.innerWidth-50);
  ty = random(50, window.innerHeight-50);

  background(248);

  population = new Population(popsize);
  target = new Target(tx, ty);
  obstacles = new GenObs(15);

  newGen = (currentValue) => currentValue.crashed == true || currentValue.lifespan == lifespan || currentValue.complete == true;
}

function draw(){
  population.run();

  obstacles.show();
  target.show();

  if (population.rockets.every(newGen)) {
    population.evaluate();
    population.selection();
    push();
    fill(color(248,248,248,25));
    stroke(0);
    rect(0,0,window.innerWidth,window.innerHeight)
    pop();

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
  generation ++;
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

  this.show = function(){
    push();
    for (let i = 0; i < this.obs.length; i++) {
      noFill()
      stroke(250,100,100,150)
      strokeWeight(1)
      rect(this.obs[i].pos.x,this.obs[i].pos.y,this.obs[i].width,this.obs[i].height)
    }
    pop();
  }
}

function Obstacle(x,y,w,h){
  this.pos = createVector(x,y);
  this.width = w;
  this.height = h;
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
    pop();
  }
}

function DNA(genes){
  if (genes) {
    this.genes = genes;
  } else{
    this.genes = [];
    this.genes[0] = []
    this.genes[0][0] = createVector(50,300)
    this.genes[0][1] = this.genes[0][0].add(createVector(random(-20,20),random(-20,20)))

    for (let i = 1; i < lifespan; i++) {
      previous = this.genes[i-1][0].copy();
      this.genes[i] = [];
      this.genes[i][0] = previous;
      this.genes[i][1] = previous.add(createVector(random(-20,20),random(-20,20)));
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
    for (let i = 1; i < this.genes.length; i++) {
      if (random(1) < 0.1) {
        previous = this.genes[i][0].copy();
        this.genes[i][0] = previous;
        this.genes[i][1] = previous.add(createVector(random(-20,20), random(-20,20)));
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
      this.rockets[i].checkIntersection();
      this.rockets[i].show();
    }
  }
}

function Rocket(dna){
  this.r = 17;

  this.pos = createVector(0, 0);
  this.prevpos = createVector();

  this.complete = false;
  this.crashed = false;
  this.lifespan = 0; //this has to be an even number

  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;
  this.prevFitness = 0;

  this.calcFitness = function(){
    let d = dist(this.pos.x, this.pos.y, target.pos.x-target.r, target.pos.y-target.r);
    this.fitness = map(d, 0, window.innerWidth, window.innerWidth, 0);

    if (this.complete) {
      this.fitness *= 10;
      this.fitness -= (this.lifespan*50);
    }
    if (this.crashed) {
      this.fitness /= 2;
    }

    // if (this.fitness > this.prevFitness) {
    //   this.prevFitness = this.fitness
    // } else {
    //   this.fitness = this.prevFitness
    // }
  }

  this.checkIntersection = function(){
    for (let i = 0; i < this.dna.genes.length; i++) {
      if (!this.crashed && !this.complete && this.lifespan != lifespan) {
        this.pos = this.dna.genes[i][0];
        for (let i = 0; i < obstacles.obs.length; i++) {
          if (
              this.pos.x >= obstacles.obs[i].pos.x -10 &&
              this.pos.x <= obstacles.obs[i].pos.x + 10 &&
              this.pos.y >= obstacles.obs[i].pos.y &&
              this.pos.y <= obstacles.obs[i].pos.y + obstacles.obs[i].height
             ) {
            this.crashed = true;
          }
        }
        let d = dist(this.pos.x,this.pos.y, target.pos.x, target.pos.y);
        if (d < target.r/2) {
          this.complete = true;
          this.pos = target.pos.copy();
        }
        if (this.pos.x > bwidth || this.pos.x < 10) {
          this.crashed = true;
        }
        if (this.pos.y > bheight || this.pos.y < 10) {
          this.crashed = true;
        }
        this.lifespan++;
      }
    }
  }

  this.show = function(){
    push();
    strokeWeight(0.2);
    stroke(0);

    beginShape(LINES)
    vertex(this.dna.genes[0][0].x, this.dna.genes[0][0].y)
    for (let i = 0; i < this.lifespan; i++) {
      vertex(this.dna.genes[i][0].x, this.dna.genes[i][0].y)
      vertex(this.dna.genes[i][1].x, this.dna.genes[i][1].y);
      push();
      fill(0,250,0);
      circle(this.dna.genes[i][0].x, this.dna.genes[i][0].y, 2);
      pop();
    }
    endShape()
    pop();
    fill(0,250,0);
    strokeWeight(0.5);
    console.log(this.lifespan-1)
    circle(this.dna.genes[this.lifespan-1][0].x, this.dna.genes[this.lifespan-1][0].y, 10);
  }
}
