class Evader {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 5;
    this.maxForce = 2;
    this.r = 3;
    this.wanderTheta = PI / 2;
    this.currentPath = [];
    this.paths = [this.currentPath];
    this.hitEdge = false;

    this.timeAlive = 0;
  }

  run(pack, prey){
    this.wander();
    // this.evade(pack);
    this.edges();
    this.show();
    this.update();
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(550);
    wanderPoint.add(this.pos);

    push();
    fill(255,0,0);
    // circle(wanderPoint.x,wanderPoint.y, 30);
    pop();

    let wanderRadius = 180;

    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta) ;
    let y = wanderRadius * sin(theta) ;
    wanderPoint.add(x,y);

    push();
    stroke(255);
    circle(wanderPoint.x, wanderPoint.y, 4);
    pop();

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    let displaceRange = 0.7;
    this.maxSpeed += sin(0.1);
    this.wanderTheta += random(-displaceRange, displaceRange);
  }

  evade(pack){
    var timer = 1;

    for (var i = 0; i < pack.length; i++) {
      if (dist(this.pos.x,this.pos.y, pack[i].pos.x,pack[i].pos.y) < 70){
        let target = pack[i].pos.copy();
        let pred = pack[i].vel.copy();
        pred.mult(-1);
        target.add(pred);
        fill(99, 203, 100);
        noStroke();
        circle(target.x,target.y,5);
        this.applyForce(target);
      }
      else {
        this.wander(1);
      }
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.currentPath.push(this.pos.copy());
    this.updatePath();
  }

  show() {
    stroke(235,25,11,255);
    strokeWeight(1);
    fill(235,25,11,255);

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();

    this.path();
  }

  updatePath(){
    let total = 0;
    for (let path of this.paths) {
      total += path.length;
    }

    if (total > 10 || (total > 1 && millis() > 3000)) {
      this.paths[0].shift();
      if (this.paths[0].length === 0) {
        this.paths.shift();
      }
    }
  }

  path(){
    for (let path of this.paths) {
      beginShape();
      noFill();
      for (let v of path) {
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = width-(this.r+10);
      this.hitEdge = true;
    } else if (this.pos.x < 0) {
      this.pos.x = this.r+10;
      this.hitEdge = true;
    }
    if (this.pos.y > height) {
      this.pos.y = height-(this.r+10);
      this.hitEdge = true;
    } else if (this.pos.y < 0) {
      this.pos.y = this.r+10;
      this.hitEdge = true;
    }

    if (this.hitEdge) {
      this.currentPath = [];
      this.paths.push(this.currentPath);
      this.vel.mult(-1);
      this.hitEdge = false;
    }
  }
}
