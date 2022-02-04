import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

import noise from './vertexShader.js';
import frag from './fragmentShader.js';


var container, renderer, scene, camera, mesh, mesh2, material, material2, fov = 45;
var start = Date.now();

window.addEventListener( 'load', init );

function init() {

	container = document.getElementById( 'container' );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 100;
	camera.target = new THREE.Vector3( 0, 0, 0 );

	scene.add( camera );

	var panoTexture = new THREE.TextureLoader().load( 'green.jpg' );

	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 60 ), new THREE.MeshBasicMaterial( { map: panoTexture } ) );
	sphere.scale.x = -1;
	sphere.doubleSided = true;
	scene.add( sphere );

	material = new THREE.ShaderMaterial( {
		uniforms: {
			tShine: { type: "t", value: panoTexture },
			time: { type: "f", value: 0 },
			weight: { type: "f", value: 0 }
		},
    wireframe: true,
		vertexShader: noise,
		fragmentShader: frag
	} );

	mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 12, 50 ), material );
	scene.add( mesh );

  // material2 = new THREE.ShaderMaterial( {
  //   uniforms: {
  //     tShine: { type: "t", value: panoTexture },
  //     time: { type: "f", value: 0 },
  //     weight: { type: "f", value: 0 }
  //   },
  //   vertexShader: noise,
  //   fragmentShader: frag
  // } );
  material.wireframe = false;
  mesh2 = new THREE.Mesh( new THREE.IcosahedronGeometry( 10, 40 ), material );
  scene.add( mesh2 );

	renderer = new THREE.WebGLRenderer( {antialias:true, alpha:true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClear = false;

	container.appendChild( renderer.domElement );

	var controls = new OrbitControls( camera, renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	render();
}

function onWindowResize() {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

var start = Date.now();

function render() {

	material.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
	material.uniforms[ 'weight' ].value = 20.0 * ( .5 + .5 * Math.sin( .00025 * ( Date.now() - start ) ) );

  // material2.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
	// material2.uniforms[ 'weight' ].value = 20.0 * ( .5 + .5 * Math.sin( .00025 * ( Date.now() - start ) ) );


	renderer.render( scene, camera );
	requestAnimationFrame( render );

}
