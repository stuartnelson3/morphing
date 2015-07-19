pi2 = Math.PI/2;
pi3 = Math.PI/3;
pi4 = Math.PI/4;

cos = Math.cos;
sin = Math.sin;
tan = Math.tan;

COLOR = 0xFFA500;
SPACING = 100;
CAMERA_DISTANCE = SPACING*5;
PARTICLE_COUNT = 50;

var sphereParticle = {
  uLim: Math.PI,
  vLim: Math.PI,
  fn: function(u, v) {
    var pX = sin(v)*cos(u);
    var pY = cos(pi2)*sin(v)*sin(u) - sin(pi2)*cos(v);
    var pZ = sin(pi2)*sin(v)*sin(u) + cos(pi2)*cos(v);
    return new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ);
  }
};

var swirlParticle = {
  uLim: 2*Math.PI,
  vLim: Math.PI,
  fn: function(u, v) {
    var pX = v*cos(u);
    var pY = v*sin(u);
    var pZ = u;
    return new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ);
  }
};

var twoSphereParticle = {
  uLim: 2*Math.PI,
  vLim: Math.PI,
  fn: function(u, v) {
    var pX = cos(3*u)/3 + sin(v)*cos(u);
    var pY = sin(3*u)/3 + sin(v)*sin(u);
    var pZ = cos(v);
    return new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ);
  }
};

var threeSphereParticle = {
  uLim: 2*Math.PI,
  vLim: Math.PI,
  fn: function(u, v) {
    var pX = cos(4*u)/4 + sin(v)*cos(u);
    var pY = sin(4*u)/4 + sin(v)*sin(u);
    var pZ = cos(v);
    return new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ);
  }
};

function generateParticles(n, particleObj) {
  var p = particleObj;
  var a = [];
  var inc = Math.PI / n;
  var i = 0;
  var l = [];

  return function() {
    for (var u = 0; u < p.uLim; u+=inc) {
      l = [];
      i = 0;
      for (var v = 0; v < p.vLim; v+=inc) {
        l[i] = p.fn(u,v);
        i++;
      }
      a.push(l);
    }
    return a;
  };
}

var sphere = generateParticles(PARTICLE_COUNT, sphereParticle);
var swirl = generateParticles(PARTICLE_COUNT, swirlParticle);
var twoSphere = generateParticles(PARTICLE_COUNT, twoSphereParticle);
var threeSphere = generateParticles(PARTICLE_COUNT, threeSphereParticle);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1500);
scene = new THREE.Scene();

var material = new THREE.LineBasicMaterial({
  color: COLOR
});

// s = swirl();
s = twoSphere();
// s = threeSphere();
// s = sphere();

s.forEach(function(points) {
  var geometry = new THREE.Geometry();
  points.forEach(function(p) {
    geometry.vertices.push(p);
  });
  var line = new THREE.Line(geometry, material);
  scene.add(line);
});

function cameraOrbit(camera) {
  var timer = new Date().getTime() * 0.0005;

  camera.position.x = cos( timer ) * CAMERA_DISTANCE;
  camera.position.z = sin( timer ) * CAMERA_DISTANCE;
}

angle = 0.01;
function update() {
  cameraOrbit(camera);
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();
