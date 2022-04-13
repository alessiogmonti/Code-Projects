class Seeker {
  constructor(x, y, id) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 1);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3; //change with genetics
    this.maxForce = 0.1; //change with genetics
    this.r = 5;
    this.xoff = 0;
    this.sight = 300;
    this.id = id;
    this.fill = color(222,222,222,255);
    this.stroke = color(22,22,22,255);
    this.target;
    this.pursuit = false;

    // this.timer = new Timer(5000);
  }

  run(pack, prey){
    this.separate(pack);
    this.find(prey);
    this.edges();
    this.update();
    this.show();
  }

  separate(others){
    let sep = map(this.r, 5, 20, 20, 5);
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

  find(prey){ //keep a global list of lowest health targets (pack intelligence)
    if (this.target && dist(this.pos.x,this.pos.y, this.target.pos.x,this.target.pos.y) < this.sight && this.target.hp > 0 && !this.target.escaped){
      this.pursue();
    } else {
      this.pursuit = false;
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
    pred.mult(2);
    target.add(pred);

    let force = p5.Vector.sub(target, this.pos);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);

    this.target.hunted = this;

    let d = dist(this.pos.x,this.pos.y, this.target.pos.x,this.target.pos.y);
    if (d < 50 && d > this.r+1) {
      this.fill = color(105,200,200);
      this.pursuit = true;
    } else if (d < this.r) {
      this.fill = color(200,0,0);
      this.pursuit = false;
      this.attack(this.target, force);
    } else {
      force.setMag(this.maxForce);
      this.pursuit = false;
    }
  }

  attack(target, force){
    target.lifedrain(this.id);
  }

  frenzy(){
    this.r += 3;
    this.maxForce += 0.05;
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
    strokeWeight(strokeweight);
    fill(this.fill);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    triangle(-this.r, this.r / 2, -this.r, -this.r / 2, this.r, 0);
    pop();
    this.fill = color(222,222,222,255);
    this.stroke = color(22,22,22,255);
  }

  edges() {
    if (this.pos.x > sw + (this.r/1.2)) {
      this.pos.x = -this.r/1.2;
    } else if (this.pos.x < -this.r/1.2) {
      this.pos.x = sw+(this.r/1.2);
    }
    if (this.pos.y > sh + (this.r/1.2)) {
      this.pos.y = -this.r/1.2;
    } else if (this.pos.y < -this.r/1.2) {
      this.pos.y = sh+(this.r/1.2);
    }
  }
}
