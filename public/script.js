var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 400;

SPACING = 150;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the particle variables
var PARTICLE_COUNT = 50;
var particles = new THREE.Geometry();
var pMaterial = new THREE.ParticleBasicMaterial({
  color: 0xFFFFFF,
  size: 1,
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
    return  new THREE.Vertex(
      new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ)
    );
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

// create the particle system
var particleSystem = new THREE.ParticleSystem(
    particles,
    pMaterial);
particleSystem.sortParticles = true;

// add it to the scene
scene.add(particleSystem);

particles.vertices = sphere();
particleSystem.rotation.y = pi2;
function update() {
  particleSystem.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();
