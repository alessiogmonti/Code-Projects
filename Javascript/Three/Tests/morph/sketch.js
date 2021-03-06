
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(2, 3, 5).setLength(4);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

scene.add(new THREE.GridHelper(4, 4));

var geom = new THREE.SphereGeometry(1, 8, 4);
// spikes morphTargets
var spikes = geom.attributes.position.array.map(v => {
  return v
});
spikes[0].y = 2;
spikes[25].y = -2;
spikes[9].x = -2;
spikes[11].z = 2;
spikes[13].x = 2;
spikes[15].z = -2;

geom.morphAttributes.position = {name: "spikes",
                                vertices: spikes};

// heart morphTargets

var heart = geom.attributes.position.array.map(v => {
  let tv = Object.assign(v);
  let absX = Math.abs(tv.x * 0.75);
  // reference for the formula of heart: https://www.youtube.com/watch?v=aNR4n0i2ZlM
  tv.y += absX * (Math.sqrt((20 - absX) / 15));
  tv.z *= 0.5;
  tv.x *= 1.2;
  return tv;
});

geom.morphTargets = {name: "heart", vertices: heart};
console.log(geom)


var mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
  color: "aqua",
  wireframe: false,
  morphTargets: true,
  transparent: true
}));
scene.add(mesh);

// tweenings

function createTween(influence, start, end, delay, colorStart, colorEnd) {
	let c = colorStart.clone();
  return new TWEEN.Tween({
    val: start,
    r: colorStart.r,
    g: colorStart.g,
    b: colorStart.b
  }).to({
    val: end,
    r: colorEnd.r,
    g: colorEnd.g,
    b: colorEnd.b
  }, 1000).delay(delay).onUpdate(function(value) {
    mesh.morphTargetInfluences[influence] = value.val;
    mesh.rotation.y = value.val * Math.PI * 2;
    mesh.material.color.setRGB(value.r, value.g, value.b);
  }).onComplete(function(value) {
    value.val = start;
    value.r = c.r;
    value.g = c.g;
    value.b = c.b;
  });
}

var tweenSpikes = createTween(0, 0, 1, 500, new THREE.Color("aqua"), new THREE.Color("purple"));
var tweenSpikesBack = createTween(0, 1, 0, 2000, new THREE.Color("purple"), new THREE.Color("aqua"));

var tweenHeart = createTween(1, 0, 1, 500, new THREE.Color("aqua"), new THREE.Color("red"));
var tweenHeartBack = createTween(1, 1, 0, 2000, new THREE.Color("red"), new THREE.Color("aqua"));

tweenSpikes.chain(tweenSpikesBack);
tweenSpikesBack.chain(tweenHeart);
tweenHeart.chain(tweenHeartBack);
tweenHeartBack.chain(tweenSpikes);
tweenSpikes.start();

render();

function render() {
  requestAnimationFrame(render);
  TWEEN.update();
  renderer.render(scene, camera);
}
