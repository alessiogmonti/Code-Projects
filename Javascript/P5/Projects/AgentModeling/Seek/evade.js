class Evader {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 1;
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

    this.signaler = false;
    this.signaling = false;
    this.escaped = false;
    this.escapeP;
    this.hunted;
  }

  run(){
    this.wander();
    this.edges();
    this.show();
    this.update();
  }

  wander(point) {
    let wanderPoint;
      if(this.signaling && this.escapeP){
        this.fill = color(97,175,239);
        wanderPoint = this.escapeP.copy();
        wanderPoint.setMag(10);
        wanderPoint.add(this.pos);
      } else if (!this.signaling && !this.hunted && this.escapeP) {
        this.fill = color(0,225,255);
        wanderPoint = this.escapeP.copy();
      } else if (!this.signaling && !this.hunted && !this.escapeP) {
        this.fill = color(100,255,25)
        wanderPoint = this.vel.copy();
        wanderPoint.setMag(90);
        wanderPoint.add(this.pos);
      }

      if (this.hunted) {
        this.escapeP = null;
        if (dist(this.pos.x,this.pos.y, this.hunted.pos.x,this.hunted.pos.y) < 30 + (this.hunted.r)){
          this.signaling = false;
          this.fill = color(236,189,248);
          this.maxSpeed = 3;
          this.maxForce = 6;

          let target = this.hunted.pos.copy();
          let pred = this.hunted.vel.copy();
          let wanderRadius = 150;
          let displaceRange = random(0.05,0.2);

          pred.mult(-1.5);
          target.add(pred);

          let theta = this.wanderTheta + this.vel.heading();
          let x = wanderRadius * sin(theta);
          let y = wanderRadius * cos(theta);

          target.add(x, y);

          let steer = target.sub(this.pos);
          steer.setMag(this.maxForce);
          this.applyForce(steer);

          this.wanderTheta += random(-displaceRange, displaceRange);
        } else {
          this.maxSpeed = 1;
          this.maxForce = 2;
          this.hunted = null;
        }
      } else {
        let wanderRadius = 3;

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
  }

  signal(seekers){
    this.signaling = true;
    for (let i = 0; i < seekers.length; i++) {
      if (dist(this.pos.x,this.pos.y, seekers[i].pos.x,seekers[i].pos.y) < 200) {
          seekers[i].escapeP = this.escapeP.copy();
      }
    }
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
    strokeWeight(strokeweight);
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
    if (this.pos.x > sw + (this.r/1.2)) {
      this.pos.x = -this.r/1.2;
      this.hitEdge = true;
    } else if (this.pos.x < -this.r/1.2) {
      this.pos.x = sw+(this.r/1.2);
      this.hitEdge = true;
    }
    if (this.pos.y > sh + (this.r/1.2)) {
      this.pos.y = -this.r/1.2;
      this.hitEdge = true;
    } else if (this.pos.y < -this.r/1.2) {
      this.pos.y = sh+(this.r/1.2);
      this.hitEdge = true;
    }

    if (this.hitEdge) {
      this.currentPath = [];
      this.paths.push(this.currentPath);
      this.hitEdge = false;
    }
  }
}
