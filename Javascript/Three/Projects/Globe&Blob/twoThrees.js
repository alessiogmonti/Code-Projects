import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import Stats from "./stats.js";
import { GUI } from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';

import noise from './vertexShader.js';
import frag from './fragmentShader.js';

function globe() {

	var width = 750;
	var height = 750;
	var radius = 168,
		scene = new THREE.Scene(),
		camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 ),
		renderer = new THREE.WebGLRenderer( { alpha: true } ),
		container = document.getElementById( 'container' ),
		controls;

	scene.background = new THREE.Color( "rgb(20,20,20)" );

	camera.position.z = 320;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );

	let containerGui = document.getElementById( 'guiPanel' );
	const gui = new GUI( { container: containerGui, width: 600 } );
	const datagui = gui.addFolder( 'data' );
	datagui.open();

	let earthPivot = new THREE.Group();

	d3.json( "./dataFranceModified.json", function ( error, topology ) {

		if ( error ) throw error;
		var countries = [];
		var cones = [];
		for ( var i = 0; i < topology.objects.countries.geometries.length; i ++ ) {

			var rgb = [];
			var newcolor;
			for ( var j = 0; j < 3; j ++ ) {

				rgb.push( Math.floor( Math.random() * 255 ) );
				newcolor = 'rgb(' + rgb.join( ',' ) + ')';

			}

			var mesh = wireframe( topojson.mesh( topology, topology.objects.countries.geometries[ i ] ), new THREE.LineBasicMaterial( { color: newcolor, linewidth: 5 } ) );
			countries.push( mesh );
			scene.add( mesh );

			mesh.geometry.computeBoundingBox();
			var center = new THREE.Vector3();
			mesh.geometry.boundingBox.getCenter( center );

		 	mesh.add( earthPivot );
			let height = 1;
			// height = height ? height : 0;
			const geometry = new THREE.SphereGeometry( height, 50, 36 );
			const material = new THREE.MeshBasicMaterial( { color: newcolor } );
			const cone = new THREE.Mesh( geometry, material );
			cone.position.copy( center );
			cone.position.setLength( radius + height );
			cone.name = topology.objects.countries.geometries[ i ].properties[ 'name' ];
			cones.push( cone );
			earthPivot.add( cone );

		}

		//translate US Cone by selection with array and xyz coords and rotation
		cones[ 16 ].position.x += 50;
		cones[ 16 ].position.z -= 15;
		cones[ 16 ].position.y -= 35;

		// cones[16].position.x += 100


		let guiobj = { loadGDP: function () {
			for ( var i = 0; i < countries.length; i ++ ) {
				cones[ i ].scale.x = topology.objects.countries.geometries[ i ].properties[ 'GDP(US$M)' ] * 0.000002;
				cones[ i ].scale.y = topology.objects.countries.geometries[ i ].properties[ 'GDP(US$M)' ] * 0.000002;
				cones[ i ].scale.z = topology.objects.countries.geometries[ i ].properties[ 'GDP(US$M)' ] * 0.000002;
			}
		},
		loadPopulation: function () {
			for ( var i = 0; i < countries.length; i ++ ) {
				cones[ i ].scale.x = topology.objects.countries.geometries[ i ].properties[ 'Population Growth Rate' ] * 2.2;
				cones[ i ].scale.y = topology.objects.countries.geometries[ i ].properties[ 'Population Growth Rate' ] * 2.2;
				cones[ i ].scale.z = topology.objects.countries.geometries[ i ].properties[ 'Population Growth Rate' ] * 2.2;
			}
		},
		pressFreedom: function () {
			for ( var i = 0; i < countries.length; i ++ ) {
				cones[ i ].scale.x = 50 / topology.objects.countries.geometries[ i ].properties[ 'Press Freedom Index' ];
				cones[ i ].scale.y = 50 / topology.objects.countries.geometries[ i ].properties[ 'Press Freedom Index' ];
				cones[ i ].scale.z = 50 / topology.objects.countries.geometries[ i ].properties[ 'Press Freedom Index' ];
			}
		},
		rotObj: true };

		datagui.add( guiobj, 'loadGDP' ).name( 'World GDP 2022(US$M)' );
		datagui.add( guiobj, 'loadPopulation' ).name( 'Population Growth 2022(%)' );
		datagui.add( guiobj, 'pressFreedom' ).name( 'Press Freedom Index 2021' );
		datagui.add( guiobj, 'rotObj' ).name( 'Rotation' );

		console.log( cones[ 0 ] );
		controls = new OrbitControls( camera, renderer.domElement );
		d3.timer( function ( t ) {
			if ( guiobj.rotObj ) {
				for ( var i = 0; i < countries.length; i ++ ) {
					countries[ i ].rotation.x = Math.sin( t / 21000 ) * Math.PI / 3 - Math.PI / 2;
					countries[ i ].rotation.z = t / 20000;
					cones[ i ].rotation.x = Math.sin( t / 21000 ) * Math.PI / 3 - Math.PI / 2;
					cones[ i ].rotation.z = t / 20000;
				}
			}
			renderer.render( scene, camera );
		} );
	} );

	// Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
	function vertex( point ) {

		var lambda = point[ 0 ] * Math.PI / 180,
			phi = point[ 1 ] * Math.PI / 180,
			cosPhi = Math.cos( phi );
		return new THREE.Vector3(
			radius * cosPhi * Math.cos( lambda ),
			radius * cosPhi * Math.sin( lambda ),
			radius * Math.sin( phi )
		);

	}

	// Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
	function wireframe( multilinestring, material ) {

		var geometry = new THREE.BufferGeometry();
		var pointsArray = new Array();
		multilinestring.coordinates.forEach( function ( line ) {

			d3.pairs( line.map( vertex ), function ( a, b ) {

				pointsArray.push( a, b );

			} );

		} );
		geometry.setFromPoints( pointsArray );
		return new THREE.LineSegments( geometry, material );

	}

}

function anim() {
	const stats = Stats();

	let containerGui = document.getElementById( 'guiPanel2' );
	containerGui.appendChild( stats.dom );
	const gui = new GUI( { container: containerGui, width: 250 } );

	const settings = {
		distortion: 0.5,
	};

	gui.add( settings, 'distortion', 0.2, 2.5, 0.5 );

	var container, renderer, scene, camera, mesh, mesh2, material, material2, fov = 20;

	var width = window.innerWidth;
	var height = window.innerHeight;
	var start = Date.now();

	window.addEventListener( 'load', init );

	function init() {

  	container = document.getElementById( 'my_dataviz' );

  	scene = new THREE.Scene();

  	camera = new THREE.PerspectiveCamera( fov, width / height, 1, 10000 );
  	camera.position.z = 95;
    camera.position.x = 55;
  	camera.target = new THREE.Vector3( 0, 0, 0 );

  	scene.add( camera );

  	var panoTexture = new THREE.TextureLoader().load( './blue.jpg' );
		// var panoTexture2 = new THREE.TextureLoader().load( './Pages/Index/gen.jpg' );

  	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 60 ), new THREE.MeshBasicMaterial( { map: panoTexture } ) );
  	sphere.scale.x = - 1;
  	sphere.doubleSided = true;
  	scene.add( sphere );

  	material = new THREE.ShaderMaterial( {
  		uniforms: {
  			tShine: { type: "t", value: panoTexture },
  			time: { type: "f", value: 0 },
  			weight: { type: "f", value: 0 },
				distortion: { type: "f", value: settings.distortion }
  		},
			wireframe: true,
  		vertexShader: noise,
  		fragmentShader: frag
  	} );

  	mesh = new THREE.Mesh( new THREE.IcosahedronGeometry( 18, 15 ), material );
		mesh.position.setX( - 20 );
  	scene.add( mesh );

		material2 = new THREE.ShaderMaterial( {
			uniforms: {
				tShine: { type: "t", value: panoTexture },
				time: { type: "f", value: 0 },
				weight: { type: "f", value: 0 }
			},
			vertexShader: noise,
			fragmentShader: frag
		} );

		mesh2 = new THREE.Mesh( new THREE.IcosahedronGeometry( 10, 40 ), material2 );
		mesh2.position.setX( - 20 );
		scene.add( mesh2 );

  	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
  	renderer.setPixelRatio( window.devicePixelRatio );
  	renderer.setSize( width, height );
  	renderer.autoClear = false;

  	container.appendChild( renderer.domElement );

  	var controls = new OrbitControls( camera, renderer.domElement );
		controls.enableZoom = false;
  	window.addEventListener( 'resize', onWindowResize, false );

  	render();

	}

	function onWindowResize() {

  	renderer.setSize( width, height );
  	camera.aspect = width / height;
  	camera.updateProjectionMatrix();

	}

	var start = Date.now();

	function render() {

  	material.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
  	material.uniforms[ 'weight' ].value = 20.0 * ( .5 + .5 * Math.sin( .00025 * ( Date.now() - start ) ) );
		material.uniforms[ 'distortion' ].value = settings.distortion;

		material2.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
  	material2.uniforms[ 'weight' ].value = 20.0 * ( .5 + .5 * Math.sin( .00025 * ( Date.now() - start ) ) );

		stats.update();
  	renderer.render( scene, camera );
  	requestAnimationFrame( render );

	}

}

// if ($('#my_dataviz:visible')) {
//   anim();
// }
//
// if ($('#my_dataviz:visible')) {
//   globe();
// }
anim();
globe();
