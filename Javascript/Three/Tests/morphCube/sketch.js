var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(10, 10, 20);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var vertexShader = [
"uniform float interpolation;",
"uniform float radius;",
"uniform float time;",
"attribute float phi;",
"attribute float theta;",
"attribute float speed;",
"attribute float amplitude;",
"attribute float frequency;",

"vec3 rtp2xyz(){ // the magic is here",
" float tmpTheta = theta + time * speed;",
" float tmpPhi = phi + time * speed;",
" float r = sin(time * frequency) * amplitude * sin(interpolation * 3.1415926);",
" float x = sin(tmpTheta) * cos(tmpPhi) * r;",
" float y = sin(tmpTheta) * sin(tmpPhi) * r;",
" float z = cos(tmpPhi) * r;",
" return vec3(x, y, z);",
"}",

"void main(){",
" vec3 newPosition = mix(position, normalize(position) * radius, interpolation);",
" newPosition += rtp2xyz();",
"	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );",
"	gl_PointSize = 1. * ( 1. / length( mvPosition.xyz ) );",
"	gl_Position = projectionMatrix * mvPosition;",
"}"
].join("\n");

var fragmentShader = [
"uniform vec3 color;",
"void main(){",
"	gl_FragColor = vec4( color, 1.0 );",
"}"
].join("\n");

var uniforms = {
	interpolation: { value: slider.value},
  radius: { value: 7.5},
  color: { value: new THREE.Color(0x00ff00)},
  time: { value: 0 }
}

var sideLenght = 20;
var sideDivision = 500;
var cubeGeom = new THREE.BoxBufferGeometry(sideLenght, sideLenght, sideLenght, sideDivision, sideDivision, sideDivision);
var attrPhi = new Float32Array( cubeGeom.attributes.position.count );
var attrTheta = new Float32Array( cubeGeom.attributes.position.count );
var attrSpeed = new Float32Array( cubeGeom.attributes.position.count );
var attrAmplitude = new Float32Array( cubeGeom.attributes.position.count );
var attrFrequency = new Float32Array( cubeGeom.attributes.position.count );
for (var attr = 0; attr < cubeGeom.attributes.position.count; attr++){
	attrPhi[attr] = Math.random() * Math.PI * 0.1;
  attrTheta[attr] = Math.random() * Math.PI * 0.1;
  attrSpeed[attr] = THREE.Math.randFloatSpread(3);
  attrAmplitude[attr] = Math.random() * 2;
  attrFrequency[attr] = Math.random() * 1.1;
}
cubeGeom.addAttribute( 'phi', new THREE.BufferAttribute( attrPhi, 1 ) );
cubeGeom.addAttribute( 'theta', new THREE.BufferAttribute( attrTheta, 1 ) );
cubeGeom.addAttribute( 'speed', new THREE.BufferAttribute( attrSpeed, 1 ) );
cubeGeom.addAttribute( 'amplitude', new THREE.BufferAttribute( attrAmplitude, 1 ) );
cubeGeom.addAttribute( 'frequency', new THREE.BufferAttribute( attrFrequency, 1 ) );

var shaderMat = new THREE.ShaderMaterial({
	uniforms: uniforms,
	vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  //wireframe: true
});
var points = new THREE.Points(cubeGeom, shaderMat);
scene.add(points);

var clock = new THREE.Clock();
var timeVal = 0;

render();
function render(){
	timeVal += clock.getDelta();
	requestAnimationFrame(render);
  uniforms.time.value = timeVal;
  uniforms.interpolation.value = slider.value;
  renderer.render(scene, camera);
}
