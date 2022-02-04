function Particle(){
  this.pos = createVector(random(width),random(height));
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 2;

  this.prevPos = this.pos.copy();

  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.follow = function(flowfield){
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = flowfield[index];
    this.applyForce(force);
  }

  this.applyForce = function(force){
    this.acc.add(force)
  }

  this.show = function(){
    // stroke(255);
    stroke(0,2);
    line(this.prevPos.x, this.prevPos.y, this.pos.x,this.pos.y)
    this.updatePrev();
  }

  this.updatePrev = function(){
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function(){
    if (this.pos.x < 0){
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.x > width){
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0){
      this.pos.y = height;
      this.updatePrev();
    }
    if (this.pos.y > height){
      this.pos.y = 0;
      this.updatePrev();
    }
  }
}
