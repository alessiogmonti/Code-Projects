let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
             'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
var paramslist = ['I','S','M','H','Q','C','H','P','D','F','K','F','B','K','E','A','L','I','F','D']

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');

  let c1 = color(0, 126, 255);
  let b1 = color(0, 0, 20);

  c1.setAlpha(100);
  b1.setAlpha(10);

  stroke(b1);
  strokeWeight(1);
  fill(c1);

  scale(5);

}

let iterpoints = [];
var itercount = 1;

function draw(){
  background(255);

  iterpoints.push(drawpoints(10, letters, paramslist);

  beginShape(LINES);
  for (var i = 0; i < iterpoints[itercount][0].length; i++) {
    vertex(iterpoints[itercount][i].x,iterpoints[itercount][i].y);
    console.log(iterpoints[itercount][i]);
  }
  endShape(CLOSE);
  itercount+=1;
}

function createParams(letters){
  let dict = {};

  var j = -1.2;
  for (var i = 0; i < 25; i++) {
    dict[letters[i]] = j;
    j+= 0.1;
  }

  return dict;
}

function getParams(letters, paramslist){
  var dict = createParams(letters);
  var params = [];
  for (var i = 0; i < paramslist.length; i++) {
    params.push(dict[paramslist[i]]);
  }

  return params;
}


// x_{n+1} = a_0 + a_1*x_n + a_2*x_n^2 + a_3*x_n^3 +
// a_4*x_n^2*y_n + a_5*x_n*y_n + a_6*x_n*y_n^2 +
// a_7*y_n + a_8*y_n^2 + a_9*y_n^3

function nx(x_n, y_n, a){
  var nxval = a[0] + a[1] * x_n + a[2] * (x_n**2) + a[3] * x_n**3 +
              a[4] * x_n**2 * y_n + a[5] * x_n * y_n + a[6] * x_n * y_n**2 +
              a[7] * y_n + a[8] * y_n**2 + a[9] * y_n**3;

  return nxval;
}

// y_{n+1} = a_{10} + a_{11}*x_n + a_{12}*x_n^2 + a_{13}*x_n^3 +
// a_{14}*x_n^2*y_n + a_{15}*x_n*y_n + a_{16}*x_n*y_n^2 +
// a_{17}*y_n + a_{18}*y_n^2 + a_{19}*y_n^3

function ny(x_n, y_n, a){
  var nyval = a[10] + a[11] * x_n + a[12] * (x_n**2) + a[13] * x_n**3 +
              a[14] * x_n**2 * y_n + a[15] * x_n * y_n + a[16] * x_n * y_n**2 +
              a[17] * y_n + a[18] * y_n**2 + a[19] * y_n**3;

  return nyval;
}

var x_n = 1;
var y_n = 1;
var x1 = [];
var y1 = [];


function genpoints(iters, letters, paramslist){
  var dt = 0.01;

  x1[0] = 10;
  y1[0] = 21;

  var alpha = getParams(letters, paramslist);

  for (var i = 0; i < iters-1; i++) {
    x1[i+1] = x1[i] + nx(x_n, y_n, alpha) * dt;
    y1[i+1] = y1[i] + ny(x_n, y_n, alpha) * dt;
  }

  return createVector(x1,y1);
}

function drawpoints(iters, letters, paramslist){
  let vecs = [];
  vecs.push(genpoints(iters, letters, paramslist));
  return vecs
}
