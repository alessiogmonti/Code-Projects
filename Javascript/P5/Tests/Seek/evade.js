class Evader {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 2;
    this.r = 8;
    this.wanderTheta = PI / 2;
    this.currentPath = [];
    this.paths = [this.currentPath];
    this.hitEdge = false;
    this.limit = 3;

    this.fill = color(100,244,25);
    this.stroke = color(0,0,0)

    this.hp = 1;
    this.stamina;

    this.killer;
    this.vulnerability;
    this.desireability;
  }

  run(pack, prey){
    this.wander();
    this.evade(pack);
    this.edges();
    this.show();
    this.update();
  }

  evade(pack){
    for (var i = 0; i < pack.length; i++) {
      if (dist(this.pos.x,this.pos.y, pack[i].pos.x,pack[i].pos.y) < 30){
        let target = pack[i].pos.copy();
        let pred = pack[i].vel.copy();
        pred.mult(-5);
        target.add(pred);
        target.setMag(50);
        this.maxSpeed = 6;
        this.applyForce(target);
      } else {
        this.maxSpeed = 2;
      }
    }
  }

  wander() {
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(50);
    wanderPoint.add(this.pos);

    let wanderRadius = 10;

    let theta = this.wanderTheta + this.vel.heading();
    let x = wanderRadius * cos(theta) ;
    let y = wanderRadius * sin(theta) ;
    wanderPoint.add(x,y);

    let steer = wanderPoint.sub(this.pos);
    steer.setMag(this.maxForce);
    this.applyForce(steer);

    let displaceRange = 0.4;
    this.wanderTheta += random(-displaceRange, displaceRange);
  }

  lifedrain(attacker){
    this.hp -= 0.1;
    if (this.hp < 0) {
      this.killer = attacker;
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
    stroke(this.stroke);
    strokeWeight(0.5);
    fill(this.fill);

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
      stroke(255);
      for (let v of path) {
        vertex(v.x, v.y);
      }
      endShape();
    }
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
      this.hitEdge = true;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
      this.hitEdge = true;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
      this.hitEdge = true;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
      this.hitEdge = true;
    }

    if (this.hitEdge) {
      this.currentPath = [];
      this.paths.push(this.currentPath);
      this.hitEdge = false;
    }
  }
}
