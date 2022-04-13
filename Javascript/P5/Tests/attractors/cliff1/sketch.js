// xn+1 = sin(a yn) + c cos(a xn)
// yn+1 = sin(b xn) + d cos(b yn)

// let x = 9.1;
// let y = 11;


//clifford
// let a = -1.4;
// let b = 1.0;
// let c = 1.5;
// let d = 0.7;

// let a = -1.4;
// let b = 1.6;
// let c = 1.0;
// let d = 0.7;

a = 1.7, b = 1.7, c = 0.6, d = 1.2;

//liuChen
// let a = 2.4;
// let b = -3.78;
// let c = 14;
// let d = -11;
// let e = 4;
// let f = 5.58;
// let g = 1;

let x,y,z;
let iterations = 0;

let pointlist = []

function liuChen(x0,y0,z0, a, b, c, d, e, f, g, iters){
  var x = x0;
  var y = y0;
  var z = z0;

  for (let i = 0; i < iters; i++) {
    var xt = x;
    var yt = y;
    var zt = z;
    x = (a*y) + (b*x) + (c*y*z);
    y = (d*y) - z + (e*x*z);
    z = (f*zt) + (g*xt*yt);
  }

  console.log(x);

  point(map(x, -4,4, 0, windowWidth), map(y, -3,3, windowHeight, 0), map(z, -3,3, 600, 0))
}

function clifford(x0, y0, a, b, c, d, iters) {
  var x = x0;
  var y = y0;

  for (i = 0; i < iters; i++) {
    var xt = x;
    var yt = y;
    x = sin(a*y) + c*cos(a*x);
    y = sin(b*xt) + d*cos(b*y)
  }

  point(map(x, -4, 4, 0, windowWidth), map(y, -3, 3, windowHeight, 0));
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('#sketch');
  // createEasyCam();
  // translate(windowWidth/2, windowHeight/2);
  // noLoop();
  background(255);
}

function draw() {
  stroke(0, 10);

  // while (iterations < 100000) {
    for (j = 0; j < 10000; j++) {
      x = random(-1, 1);
      y = random(-1, 1);
      z = random(-1, 1);
      clifford(x, y, a, b, c, d, 100);
      // liuChen(x,y,z, a,b,c,d,e,f,g, 100)
      // iterations ++;
    }
  // }
}

// function draw(){
//   background(255);
//
//   for (var i = 0; i < 2000; i++) {
//
//
//   let dt = 1.35;
//   let dx = sin( ( a * y ) ) + c * cos( ( a * x ) ) *dt;
//   let dy = sin( ( b * x ) ) + d * cos( ( b * y ) ) *dt;
//
//   x = x+dx;
//   y = y+dy;
//
//   pointlist.push(createVector(x,y));
//   // console.log(x,y);
//
//   let c1 = color(0, 126, 255);
//   let b1 = color(0, 0, 20);
//
//   c1.setAlpha(10);
//   b1.setAlpha(100);
//
//   stroke(b1);
//   strokeWeight(1);
//   fill(c1);
//
//   scale(5);
//
//   beginShape(POINTS);
//   for (var i = 0; i < pointlist.length; i++) {
//     vertex(pointlist[i].x,pointlist[i].y);
//     // console.log(pointlist[i]);
//   }
//   endShape(CLOSE);
//   }
// }
