let cols, rows;
let w = 20;
let h = 20;
let grid = [];

let current;
let stack = [];


function setup(){
  createCanvas(600,600);
  cols = floor(width/w);
  rows = floor(height/h);
  // frameRate(5);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = new Cell(i,j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw(){
  background(51);

  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  console.log(current);
  current.visited = true;
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function removeWalls(a,b){
  let x = a.i - b.i;
  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }

  let y = a.j - b.j;
  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

function index(i, j){
  if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
    return -1;
  }
  return i+j * cols;
}

function Cell(i, j){
  this.i = i;
  this.j = j;
  this.walls = {top:true,right:true,bottom:true,left:true};
  this.visited = false;

  this.checkNeighbors = function(){ // this needs optimizing
    let neighbors = [];

    let top = grid[index(this.i, this.j-1)];
    let right = grid[index(this.i+1, this.j)];
    let bottom = grid[index(this.i, this.j+1)];
    let left = grid[index(this.i-1, this.j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }

    if (right && !right.visited) {
      neighbors.push(right);
    }

    if (bottom && !bottom.visited) {
      neighbors.push(bottom)
    }

    if (left && !left.visited) {
      neighbors.push(left)
    }

    if (neighbors.length > 0) {
      let r = floor(random(0,neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  this.show = function(){
    let x = this.i*w;
    let y = this.j*h;

    stroke(250);
    if (this.walls.top) {
      line(x,y, x+w, y);
    }
    if (this.walls.right) {
      line(x+w,y, x+w, y+h);
    }
    if (this.walls.bottom) {
      line(x+w,y+h, x, y+h);
    }
    if (this.walls.left) {
      line(x,y+h, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(200,20,20);
      rect(x,y, w, h);
    }
  }
}
