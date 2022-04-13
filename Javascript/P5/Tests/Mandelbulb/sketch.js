// z = z^n + c
// c =

let dim = 128;
let pointList = [];
let maxiters = 20;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  createEasyCam();
  canvas.parent('#sketch');
  calculateBulb();
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(0.5);
  for (let i = 0; i < pointList.length; i++) {
    point(pointList[i].x, pointList[i].y, pointList[i].z);
  }
  // translate(windowWidth/2, windowHeight/2);
}

class Spherical{
  constructor(r, theta, phi){
    this.r = r;
    this.theta = theta;
    this.phi = phi;
  }
}

function spherical(x, y, z){
    let r = Math.sqrt( x*x + y*y + z*z );
    let theta = Math.atan2( Math.sqrt(x*x + y*y), z );
    let phi = Math.atan2( y, x)

    return new Spherical(r, theta, phi);
}

function calculateBulb(){
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {

      let edge = false;

      for (let k = 0; k < dim; k++) {
        let x = map(i, 0, dim, -1, 1);
        let y = map(j, 0, dim, -1, 1);
        let z = map(k, 0, dim, -1, 1);

        let zeta = createVector(0,0,0);

        let n = 10;
        let iteration = 0;

        // while (iteration < maxiters) {
        while(true){

          let sphericalZeta = spherical(zeta.x,zeta.y,zeta.z);

          let newx = Math.pow(sphericalZeta.r,n) * Math.sin(sphericalZeta.theta * n) * Math.cos(sphericalZeta.phi*n);
          let newy = Math.pow(sphericalZeta.r,n) * Math.sin(sphericalZeta.theta * n) * Math.sin(sphericalZeta.phi*n);
          let newz = Math.pow(sphericalZeta.r,n) * Math.cos(sphericalZeta.theta * n);

          zeta.x = newx + x;
          zeta.y = newy + y;
          zeta.z = newz + z;

          iteration ++;

          if(sphericalZeta.r > 2){
            if (edge) {
              edge = false;
            }
            break;
          }

          if (iteration > maxiters) {
            if (!edge) {
              edge = true;
              pointList.push( createVector(x*100, y*100, z*100) );
            }
            break;
          }
        }
      }
    }
  }
}
