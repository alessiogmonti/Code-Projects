class Seeker {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4; //change with genetics
    this.maxForce = 0.2; //change with genetics
    this.r = 8;
    this.xoff = 0;
    this.sight = 300;

    this.targets = [];
  }

  run(pack, prey){
    this.separate(pack);
    this.updateTargets(prey);
    this.find();
    this.edges();
    this.update();
    this.show();
  }

  separate(others){
    let sep = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < others.length; i++) {
      let d = p5.Vector.dist(this.pos,others[i].pos);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < sep)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.pos, others[i].pos);
        diff.normalize();
        diff.div(d);        // Weight by distance
        steer.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    this.applyForce(steer);
  }

  updateTargets(prey){
    this.targets = prey;
    //each pack member retains a list of targets in memory
  }

  find(){
    for (let i = 0; i < this.targets.length; i++) {
      let d = dist( this.pos.x,this.pos.y, this.targets[i].pos.x,this.targets[i].pos.y )
      if (d < this.sight + this.targets[i].r) {
        push();
        stroke(255,100,20);
        noFill();
        pop();

        circle(this.pos.x, this.pos.y, this.sight);
        this.pursue(this.targets[i])
      } else {
        let angle = noise(this.xoff) * TWO_PI * 2;
        let steer = p5.Vector.fromAngle(angle);
        steer.setMag(0.01);
        this.applyForce(steer);
        this.xoff += 0.001;
      }
    }
  }

  pursue(tget){
    let target = tget.pos.copy();
    let pred = tget.vel.copy();
    let lookahead = 10;
    let distance = 0.5* p5.Vector.dist(target,this.pos);
    pred.setMag()
    pred.mult(20);
    target.add(pred);
    // fill(99, 203, 100);
    // noStroke();
    circle(target.x,target.y,5);

    return this.seek(target);
  }

  // attack(){
  //
  // }

  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    let stopping = dist(this.pos.x,this.pos.y,target.x,target.y);
    let slowRad = 50;
    if (stopping <=slowRad) {
      let desiredSpeed = map(stopping, 0, slowRad, 0, this.maxSpeed);
      force.setMag(desiredSpeed)
    } else {
      force.setMag(this.maxSpeed);
    }
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    push();
    stroke(22,22,22,255);
    strokeWeight(0.5);
    fill(222,222,222,255);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
