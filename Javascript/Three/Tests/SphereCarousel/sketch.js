import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import {GUI} from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';

var width = 750,
height = 750,
// var radius = 168,
mesh,
scene = new THREE.Scene(),
camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000),
renderer = new THREE.WebGLRenderer({alpha: true}),
container = document.getElementById( 'container' ),
controls;

scene.background = new THREE.Color( "rgb(20,20,20)" )

controls = new OrbitControls( camera, renderer.domElement );

function myCarousel(){
  const image_radius = 100,
        number_of_images = 8,
        radius = 400,
        center = {x:250, y:250},//window.innerWidth, y: window.innerHeight}, //change this
        radian_interval = (2.0 * Math.PI) / number_of_images;

  const group_images = new THREE.Group();

  let texture, material, circle = null;

  let loader = new THREE.TextureLoader();
  for (let i = 0; i < number_of_images.length; i++) {
    texture = loader.load('./ghSphere.jpg');
    texture.minFilter = THREE.LinearFilter

    material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1
    });

    circle = new THREE.CircleGeometry(image_radius, 100);
    mesh = new THREE.Mesh(circle, material);

    mesh.material.side = THREE.DoubleSide;

    mesh.position.set(
      center.x + (Math.cos(radian_interval * i) * radius),
      center.y + (Math.sin(radian_interval * i) * radius),
      0
    )

    group_images.add(mesh);
  }
  console.log(group_images)
  scene.add(group_images)

  let scroll_speed = 0.0;

  window.addEventListener('wheel', event => {
      scroll_speed = event.deltaY * (Math.PI / 180) * 0.2;
      group_images.rotation.z += -1.0 * scroll_speed;
      for (let i = 0; i < group_images.children.length; i++) {
          group_images.children[i].rotation.z += scroll_speed;
      }
  });

  // camera.position.z = 70;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  requestAnimationFrame(animate);

  function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  }
}

myCarousel();
