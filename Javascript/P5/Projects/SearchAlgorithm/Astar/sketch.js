function removeFromArray(arr, elt){
  for(let i  = arr.length-1; i>=0; i--){
    if(arr[i] == elt){
      arr.splice(i, 1);
    }
  }
}

function heuristic(a,b){
  let d = abs(a.x-b.x) + abs(a.y-b.y)
  return d;
}

let cols = 90;
let rows = 35;
let grid = new Array(cols);

let openSet = []
let closedSet = []
let start;
let end;

let w,h;
let path = [];

function setup() {
  pixelDensity(7.0);
  createCanvas(900, 350);
  console.log(windowWidth,windowHeight);
  w = width/cols
  h = height/rows;

  for(let i = 0; i < cols; i++){
    grid[i] = new Array(rows);
  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];

  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  if(openSet.length > 0){
    let winner = 0;
    for(let i = 0; i < openSet.length; i++){
      if (openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }

   var current = openSet[winner];

    if(current === end){
      noLoop();
      console.log('done')
    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for(let i = 0; i < neighbors.length; i++){
      let neighbor = neighbors[i];
      if(!closedSet.includes(neighbor) && !neighbor.wall){
        let tempg = current.g + 1;//heuristic(neighbor, current);

        var newPath = false;
        if(openSet.includes(neighbor)){
          if(tempg < neighbor.g){
              neighbor.g = tempg;
              newPath = true;
            }
        } else {
          neighbor.g = tempg;
          newPath = true;
          openSet.push(neighbor);
        }
        if(newPath){
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g+neighbor.h
          neighbor.previous = current;
        }
      }
    }
  } else {
    return;
    noLoop();
  }

  background(255);

  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid[i][j].show()
    }
  }

  for(let i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(199,220,255)); //10,251,91
  }
  for(let i = 0; i < openSet.length; i++){
    openSet[i].show(color(210,10,91));
  }

  path = [];
  let temp = current;
  path.push(temp)
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous
  }

  push();
  stroke(15,231,81);
  strokeWeight(2);
  noFill();
  // fill(color(199,220,255,200));
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x *w + w/2, path[i].y*h+h/2)
  }
  endShape();
  pop();
}
