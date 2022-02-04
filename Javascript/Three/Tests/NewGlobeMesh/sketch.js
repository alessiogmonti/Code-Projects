import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import {OrbitControls} from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
// import Stats from "./Pages/Index/stats.js";
import {GUI} from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';

function globe(){
  var width = 750;
  var height = 750;
  var radius = 168,
      mesh,
      graticule,
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

  const geometry = new THREE.SphereGeometry(150, 52, 36 );
  const material = new THREE.MeshBasicMaterial( { color: "rgb(100,139,229)", opacity:0.3, transparent: true} );
  const sphere = new THREE.Mesh( geometry, material );

  let containerGui = document.getElementById('guiPanel')
  const gui = new GUI({ container:containerGui, width:600 });
  const colorgui = gui.addFolder('world colors');
  colorgui.add(sphere.material.color, 'r', 0, 1);
  colorgui.add(sphere.material.color, 'g', 0, 1);
  colorgui.add(sphere.material.color, 'b', 0, 1);
  const datagui = gui.addFolder('data');
  colorgui.open();

  let earthPivot = new THREE.Group();
  let guiobj = { gdp : true};

  d3.json("./data.json", function(error, topology) {
    if (error) throw error;
    var countries = []
    var cones = []
    for (var i = 0; i < topology.objects.countries.geometries.length; i++) {
      var rgb = [];
      var newcolor;
      for(var j = 0; j < 3; j++){
        rgb.push(Math.floor(Math.random() * 255));
        newcolor = 'rgb('+ rgb.join(',') +')';
      }

      var mesh = wireframe(topojson.mesh(topology, topology.objects.countries.geometries[i]), new THREE.LineBasicMaterial({color:newcolor, linewidth: 5}))
      countries.push(mesh);
      scene.add(mesh);

      var center = new THREE.Vector3();
      mesh.geometry.computeBoundingBox()
      mesh.geometry.boundingBox.getCenter(center)

		  mesh.add( earthPivot );
      let height = topology.objects.countries.geometries[i].properties['GDP(US$M)'] * 0.000002
      height = height ? height : 0;
      const geometry = new THREE.SphereGeometry( height, 50, 36);
      const material = new THREE.MeshBasicMaterial( {color: newcolor} );
      const cone = new THREE.Mesh( geometry, material );
      console.log(cone)
      cone.position.x = center.x;
      cone.position.y = center.y;
      cone.position.z = center.z
      cone.name = topology.objects.countries.geometries[i].properties['name']

      cones.push(cone);
      earthPivot.add( cone );
    }
    datagui.add(guiobj, 'gdp');

    controls = new OrbitControls( camera, renderer.domElement );
    d3.timer(function(t) {
      for (var i = 0; i < countries.length; i++) {
        countries[i].rotation.x = Math.sin(t / 21000) * Math.PI / 3 - Math.PI / 2;
        countries[i].rotation.z = t / 20000;
        cones[i].rotation.x = Math.sin(t / 21000) * Math.PI / 3 - Math.PI / 2;
        cones[i].rotation.z = t / 20000;

      }
      renderer.render(scene, camera)
    });
  });

  // Converts a point [longitude, latitude] in degrees to a THREE.Vector3.
  function vertex(point) {
    var lambda = point[0] * Math.PI / 180,
    phi = point[1] * Math.PI / 180,
    cosPhi = Math.cos(phi);
    return new THREE.Vector3(
      radius * cosPhi * Math.cos(lambda),
      radius * cosPhi * Math.sin(lambda),
      radius * Math.sin(phi)
    );
  }

  // Converts a GeoJSON MultiLineString in spherical coordinates to a THREE.LineSegments.
  function wireframe(multilinestring, material) {
    var geometry = new THREE.BufferGeometry;
    var pointsArray = new Array();
    multilinestring.coordinates.forEach(function(line) {
      d3.pairs(line.map(vertex), function(a, b) {
        pointsArray.push(a,b);
      });
    });
    geometry.setFromPoints(pointsArray);
    return new THREE.LineSegments(geometry, material);
  }

  // See https://github.com/d3/d3-geo/issues/95
  function graticule10() {
    var epsilon = 1e-6,
    x1 = 180, x0 = -x1, y1 = 80, y0 = -y1, dx = 20, dy = 20,
    X1 = 180, X0 = -X1, Y1 = 90, Y0 = -Y1, DX = 90, DY = 360,
    x = graticuleX(y0, y1, 0.5), y = graticuleY(x0, x1, 0.5),
    X = graticuleX(Y0, Y1, 0.5), Y = graticuleY(X0, X1, 0.5);

    function graticuleX(y0, y1, dy) {
      var y = d3.range(y0, y1 - epsilon, dy).concat(y1);
      return function(x) { return y.map(function(y) { return [x, y]; }); };
    }

    function graticuleY(x0, x1, dx) {
      var x = d3.range(x0, x1 - epsilon, dx).concat(x1);
      return function(y) { return x.map(function(x) { return [x, y]; }); };
    }

    return {
      type: "MultiLineString",
      coordinates: d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X)
      .concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y))
      .concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) { return Math.abs(x % DX) > epsilon; }).map(x))
      .concat(d3.range(Math.ceil(y0 / dy) * dy, y1 + epsilon, dy).filter(function(y) { return Math.abs(y % DY) > epsilon; }).map(y))
    };
  }
}
globe();
