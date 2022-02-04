import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import {GUI} from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';

var width = 750;
var height = 750;
var radius = 168,
mesh,
scene = new THREE.Scene(),
camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000),
renderer = new THREE.WebGLRenderer({alpha: true}),
container = document.getElementById( 'container' ),
controls;

scene.background = new THREE.Color( "rgb(20,20,20)" )

camera.position.z = 320;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

controls = new OrbitControls( camera, renderer.domElement );

requestAnimationFrame(animate);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
