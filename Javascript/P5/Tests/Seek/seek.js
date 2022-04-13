class Seeker {
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 1);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4; //change with genetics
    this.maxForce = 0.1; //change with genetics
    this.r = 5;
    this.xoff = 0;
    this.sight = 300;
    this.id = id;
    this.fill = color(222,222,222,255);
    this.stroke = color(22,22,22,255);
    this.target;

    this.timer = new Timer(5000);
  }

  run(pack, prey){
    this.separate(pack);
    this.find(prey);
    this.edges();
    this.update();
    this.show();
  }

  separate(others){
    let sep = 50/this.r;
    let steer = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < others.length; i++) {
      let d = p5.Vector.dist(this.pos,others[i].pos);
      if ((d > 0) && (d < sep)) {
        let diff = p5.Vector.sub(this.pos, others[i].pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
        this.stroke = color(150,120,200);
        this.fill = color(150,120,200);
      }
    }
    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce+1);
    }
    this.applyForce(steer);
  }

  find(prey){
    if (this.target && dist(this.pos.x,this.pos.y, this.target.pos.x,this.target.pos.y) < this.sight && this.target.hp > 0){
      this.pursue();
    } else {
      let angle = noise(this.xoff) * TWO_PI * 1.5;
      let steer = p5.Vector.fromAngle(angle);

      steer.setMag(this.maxForce);
      this.applyForce(steer);
      this.xoff += 0.0001;

      for (let i = 0; i < prey.length; i++) {
        let d = dist( this.pos.x,this.pos.y, prey[i].pos.x,prey[i].pos.y )
        if (d < this.sight) {
          this.target = prey[i];
        }
      }
    }
  }

  pursue(){
    push();
    stroke(0,0,0,20);
    line(this.pos.x,this.pos.y,this.target.pos.x,this.target.pos.y) //onsight
    pop();

    let target = this.target.pos.copy();
    let pred = this.target.vel.copy();
    // let distance = 0.9 * p5.Vector.dist(target,this.pos);

    // pred.setMag(distance);
    pred.mult(1);
    target.add(pred);

    // circle(target.x,target.y,5);

    let force = p5.Vector.sub(target, this.pos);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);

    let stopping = dist(this.pos.x,this.pos.y,target.x,target.y);
    if (stopping <= this.r) {
      // let desiredSpeed = 0.1;     //map(stopping, 0, slowRad, 0, this.maxSpeed);
      // force.setMag(desiredSpeed)
      this.attack(this.target, force);
      this.stroke = color(200,0,0);
      this.fill = color(200,0,0);
    } else {
      force.setMag(this.maxForce);
    }
  }

  attack(target, force){
    force.setMag(0.1);
    target.lifedrain(this.id);
  }

  frenzy(){
    this.r += 3;
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
    stroke(this.stroke);
    strokeWeight(0.5);
    fill(this.fill);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    // circle(0,0,this.r);
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    triangle(-this.r, this.r / 2, -this.r, -this.r / 2, this.r, 0);
    pop();
    this.fill = color(222,222,222,255);
    this.stroke = color(22,22,22,255);
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
