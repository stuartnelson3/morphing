var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 600;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the particle variables
var particleCount = 1800,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 3,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

scene.add(camera);

// now create the individual particles
function generateParticles(n) {
  var a = [];
  for (var p = 0; p < n; p++) {

    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
        particle = new THREE.Vertex(
          new THREE.Vector3(pX, pY, pZ)
        );

    // add it to the geometry
    a[p] = particle;
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
function update() {
  particleSystem.rotation.y += 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();
