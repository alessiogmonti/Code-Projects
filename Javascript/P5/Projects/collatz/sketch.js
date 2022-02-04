let tree;
let branch;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('#sketch');
  // let bc = color(19, 70, 35);
  let sc = color(209,241,245);
  sc.setAlpha(200);
  strokeWeight(0.1);
  stroke(sc);

  let bc = color(10, 16, 35);
  bc.setAlpha(250);
  background(bc);

  tree = new Tree();

  for (var i = 2; i < 50000; i++) {
    branch = new Branch(i);
    tree.addBranch(branch);
  }
}

let kk = 2;
function draw(){
  tree.run(kk);
  kk+=5;
}

function Tree(){
  this.branches = [];
}

Tree.prototype.addBranch = function(branch){
  this.branches.push(branch);
}

Tree.prototype.run = function(i){
  // for (var i = 0; i < this.branches.length; i++) {
    this.branches[i].run();
  // }
}

function Branch(initer){
  this.n = initer;
  this.intlist = [];
  do {
    this.intlist.push(this.n);
    this.n = collatz(this.n);
  } while (this.n != 1);
  this.intlist.push(1);
  this.intlist.reverse();

  this.len = 5;
  this.angle = 0.19;
}

Branch.prototype.run = function(){
  this.render();
}

Branch.prototype.render = function(){
  resetMatrix();
  translate(windowWidth/2,windowHeight/2);
  for (let j = 0; j < this.intlist.length; j++) {
    this.val = this.intlist[j];
    if (this.val%2 == 0) {
      rotate(this.angle);
    } else {
      rotate(-this.angle+0.1);
    }
    line(0,0,0,-this.len);
    translate(0,-this.len)
  }
}

function collatz(n){
  if (n%2 == 0){
    return n/2;
  } else {
    return (n*3+1)/2;
  }
}
