var xmax = [-20,10];
var ymax =  [-30,10];


var x = arange(xmax[0], xmax[1], 1);
var y = arange(ymax[0], ymax[1], 1);

let flock;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');

  // vec1 = createVector(x,y,rbrock(x,y));

  flock = new Flock();

  // for (var i = 0; i < vec1.x.length; i++) {
  //   elem = new Element(vec1.x[i],vec1.y[i],vec1.z[i]);
  //   flock.addElement(elem);
  // }
  for (var i = 0; i < x.length; i++) {
    // var j = random(-4,4);
    // var k = random(-5,5);
    elem = new Element(x[i], y[i], rbrock(x[i],y[i]));
    flock.addElement(elem);
  }
}

function draw(){
  background(250);
  flock.run();
  orbitControl(1);
}

function Flock() {
  this.elements = [];
}

Flock.prototype.addElement = function(elem){
  this.elements.push(elem);
}

Flock.prototype.run = function(){
  for (var i = 0; i < this.elements.length; i++) {
    this.elements[i].run();
  }
}

function randRange(){

}

function Element(x, y, z) {
  // this.acceleration = createVector(0, 0);
  // this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  // this.r = 12.0;
  this.r = z;
  // this.maxspeed = 3;    // Maximum speed
  // this.maxforce = 0.05; // Maximum steering force
}

Element.prototype.run = function(){
  // this.borders();
  this.render();
  // this.rotate();
}

Element.prototype.rotate = function(){
}

Element.prototype.render = function(){
  fill(223);
  stroke(90);
  push();
  // let mapx = map(this.position.x, xmax[0], xmax[1], -100, 10, true);
  // let mapy = map(this.position.y, ymax[0], ymax[1], -100, 10, true);
  // let mapz = map(this.position.z, -1, 1, -30,30);
  translate(this.position.x, this.position.y);
  // translate(this.position.x,this.position.y,this.position.z);
  // rotate(10);
  r2 = this.r*2;
  // rotateX(frameCount*0.0001);
  // rotateY(frameCount*0.0001);
  // rotateZ(frameCount*0.0001);

  // ellipse(0,0,this.r);
  cone(40,this.r);
  pop();
  // beginShape();
  // line(0,0,0,r2,0,0);
  // line(r2,0,0,r2,r2,0);
  // line(r2,r2,0,0,r2,0);
  // line(0,r2,0,0,0,0);
  // line(0,0,0,this.r,this.r,r2);
  // line(r2,0,0,this.r,this.r,r2);
  // line(r2,r2,0,this.r,this.r,r2);
  // line(0,r2,0,this.r,this.r,r2);
  // endShape();
}

Element.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

function rbrock(x,y){
  var b = 10;
  return (x-1)**2 + b*(y-x**2)**2
}

function arange(start,stop,step){
  var arr = [];
  for (var i=start;i<stop;i+=step){
     arr.push(i);
  }
  return arr;
}
