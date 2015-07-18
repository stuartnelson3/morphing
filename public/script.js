var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 400;

SPACING = 150;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the particle variables
var particleCount = 50,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
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

// now create the individual particles
function generateParticles(n) {
  var lim = Math.PI;
  var a = [];
  var inc = lim / n;
  var i = 0;
  for (var u = 0; u < Math.PI; u+=inc) {
    for (var v = 0; v < Math.PI; v+=inc) {

      // create a particle with random
      // position values, -250 -> 250
      var pX = sin(v)*cos(u),
          pY = cos(pi2)*sin(v)*sin(u) - sin(pi2)*cos(v),
          pZ = sin(pi2)*sin(v)*sin(u) + cos(pi2)*cos(v),
          particle = new THREE.Vertex(
            new THREE.Vector3(SPACING*pX, SPACING*pY, SPACING*pZ)
          );

      // add it to the geometry
      a[i] = particle;
      i++;
    }
  }
  return a;
}

// create the particle system
var particleSystem = new THREE.ParticleSystem(
    particles,
    pMaterial);
particleSystem.sortParticles = true;

// add it to the scene
scene.add(particleSystem);

particles.vertices = generateParticles(particleCount);
particleSystem.rotation.y = pi2;
function update() {
  particleSystem.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();
