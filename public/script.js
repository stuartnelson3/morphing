var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.z = 800;

SPACING = 100;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the particle variables
var PARTICLE_COUNT = 50;
var particles = new THREE.Geometry();
var pMaterial = new THREE.ParticleBasicMaterial({
  color: 0xFFA500,
  size: 2,
  blending: THREE.AdditiveBlending,
  transparent: true
});

scene.add(camera);

pi2 = Math.PI/2;
pi3 = Math.PI/3;
pi4 = Math.PI/4;

cos = Math.cos;
sin = Math.sin;
tan = Math.tan;

var sphereParticle = {
  uLim: Math.PI/12,
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

// now create the individual particles
function generateParticles(n, particleObj) {
  var p = particleObj;
  var a = [];
  var inc = Math.PI / n;
  var i = 0;

  return function() {
    for (var u = 0; u < p.uLim; u+=inc) {
      for (var v = 0; v < p.vLim; v+=inc) {
        a[i] = p.fn(u,v);
        i++;
      }
    }
    return a;
  };
}

var sphere = generateParticles(PARTICLE_COUNT, sphereParticle);
var swirl = generateParticles(PARTICLE_COUNT, swirlParticle);
var twoSphere = generateParticles(PARTICLE_COUNT, twoSphereParticle);
var threeSphere = generateParticles(PARTICLE_COUNT, threeSphereParticle);

// create the particle system
var particleSystem = new THREE.ParticleSystem(
    particles,
    pMaterial);
particleSystem.sortParticles = true;

// add it to the scene
scene.add(particleSystem);

// particles.vertices = sphere();
// particles.vertices = swirl();
// particles.vertices = twoSphere();
particles.vertices = threeSphere();

particleSystem.rotation.y = pi4;
function update() {
  particleSystem.rotation.y += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();
