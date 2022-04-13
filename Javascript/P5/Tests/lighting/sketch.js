let lifespan = 200;
let genes = [];
let previous;
let prevpos;

function setup(){
  createCanvas(window.innerWidth, window.innerHeight);

  background(255);

  genes[0] = createVector(50,50);

  stroke(0);
  strokeWeight(1);
  // for (var i = 1; i < genes.length; i++) {
  //   prevpos = genes[i-1];
  //   line(prevpos.x, prevpos.y, genes[i].x, genes[i].y);
  // }
  // dna = new DNA();
}

function draw(){
  beginShape(LINES)
  vertex(genes[0].x, genes[0].y);
  for (let i = 1; i < lifespan; i++) {
    previous = genes[i-1].copy();
    genes[i] = previous.add(createVector(random(-10,10),random(-10,10)));
    vertex(previous.x, previous.y);
    vertex(genes[i].x, genes[i].y);
  }
  endShape()
  // dna.show();
}






function Branch(dna){
  if(dna){
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.show = function(){
    stroke(0);
    for (var i = 1; i < this.dna.length; i++) {
      prevpos = this.dna[i-1]
      line(prevpos.x, prevpos.y, this.dna[i].x, this.dna[i].y)
    }
  }
}

function DNA(genes){

  if (genes) {
    this.genes = genes
  } else {
    this.genes = [];
    this.genes[0] = createVector(50,50);

    for (let i = 1; i < lifespan; i++) {
      previous = this.genes[i-1];
      this.genes[i] = previous.add(createVector(random(-10,10),random(-10,10)));
      // console.log(this.genes[i])
    }
  }

  this.branch = new Branch(this.genes);

  this.show = function(){
    this.branch.show();
  }

  // this.crossover = function(partner){
  //   let newDNA = [];
  //   let mid = floor(random(this.genes.length));
  //
  //   for (let i = 0; i < this.genes.length; i++){
  //     if (i > mid){
  //       newDNA[i] = this.genes[i];
  //     } else {
  //       newDNA[i] = partner.genes[i];
  //     }
  //   }
  //   return new DNA(newDNA)
  // }
  //
  // this.mutation = function(){
  //   for (let i = 0; i < this.genes.length; i++) {
  //     if (random(1) < 0.01) {
  //       this.genes[i] = createVector(random(-1,1), random(-1,1));
  //     }
  //   }
  // }
}
