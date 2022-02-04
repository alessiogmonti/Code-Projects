class Spot{
  constructor(i,j){
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.previous = 0;

    this.wall = false;

    if(random(1) < 0.5){
      this.wall = true;
    }
  }

  addNeighbors(grid){

    if (this.x < cols - 1) {
      this.neighbors.push(grid[this.x+1][this.y])
    }
    if (this.x > 0){
      this.neighbors.push(grid[this.x-1][this.y])
    }
    if (this.y < rows -1){
      this.neighbors.push(grid[this.x][this.y+1])
    }
    if (this.y > 0){
    this.neighbors.push(grid[this.x][this.y-1])
    }
    if (this.x > 0 && this.y > 0) {
      this.neighbors.push(grid[this.x - 1][this.y - 1]);
    }
    if (this.x < cols - 1 && this.y > 0) {
      this.neighbors.push(grid[this.x + 1][this.y - 1]);
    }
    if (this.x > 0 && this.y < rows - 1) {
      this.neighbors.push(grid[this.x - 1][this.y + 1]);
    }
    if (this.x < cols - 1 && this.y < rows - 1) {
      this.neighbors.push(grid[this.x + 1][this.y + 1]);
    }
  }

  show(col){
    if (this.wall) {
      fill(105)
      strokeWeight(0.1);
      stroke(255);
      ellipse(this.x * w + w/2, this.y * h + h/2, w/2,h/2 )
      // triangle(this.x *w+w/2-4, this.y * h + h/2 + 4, this.x *w+w/2-1,this.y * h+h/2 - 4,this.x *w+w/2+2, this.y * h+h/2+4)
    } else if (col) {
      fill(col)
      rect(this.x * w,this.y * h, w-1,h-1 );
    }
  }
}
