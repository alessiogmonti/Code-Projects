var all = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
             'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

var code = ['I','S','M','H','Q','C','H','P','D','F','K','F','B','K','E','A','L','I','F','D']

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

function genpoints(iters, letters, paramslist){
  var dt = 0.01;
  var x_n = 1;
  var y_n = 2;
  var alpha = getParams(letters, paramslist);

  var veclist = [];

  for (var i = 0; i < iters-1; i++) {
    var dx = nx(x_n, y_n, alpha) * dt;
    var dy = ny(x_n, y_n, alpha) * dt;
    console.log(dx);
    x_n = x_n + dx;
    y_n = y_n + dy;

    veclist.push(createVector(x_n,y_n));
  }

  return veclist
}


function drawpoints(iters, letters, paramslist){
  var vecs = genpoints(iters, letters, paramslist);

  beginShape(LINES);
  for (var i = 0; i < vecs.length; i++) {
    vertex(vecs[i].x,vecs[i].y);
    console.log(vecs[i][0]);
  }
  endShape(CLOSE);
}


function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('#sketch');

  let c1 = color(0, 126, 255);
  let b1 = color(0, 0, 20);

  c1.setAlpha(10);
  b1.setAlpha(100);

  stroke(b1);
  strokeWeight(1);
  fill(c1);
}

var x_n = 1;
var y_n = 2;
var veclist = [];

function draw(){
  background(25);
  //
  // var pts = drawpoints(10, all, code);

  var dt = 0.1;
  var alpha = getParams(all, code);

  var dx = nx(x_n, y_n, alpha) * dt;
  var dy = ny(x_n, y_n, alpha) * dt;

  x_n = x_n + dx;
  y_n = y_n + dy;

  veclist.push(createVector(x_n,y_n));

  scale(5);

  beginShape(LINES);
  for (var i = 0; i < veclist.length; i++) {
    vertex(veclist[i].x,veclist[i].y);
    console.log(veclist[i].x);
  }
  endShape(CLOSE);
}
