pi2 = Math.PI/2;
pi3 = Math.PI/3;
pi4 = Math.PI/4;

cos = Math.cos;
sin = Math.sin;
tan = Math.tan;

COLOR = 0xFFA500;
SPACING = 100;
CAMERA_DISTANCE = SPACING*5;
DRAW_DISTANCE = 1500;
PARTICLE_COUNT = 50;

var sphereParticle = {
  uLim: 2*Math.PI,
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
  var inc = p.vLim / n;
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

var shapes = {
  sphere: sphere,
  swirl: swirl,
  twoSphere: twoSphere,
  threeSphere: threeSphere
}

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, DRAW_DISTANCE);
scene = new THREE.Scene();

var material = new THREE.LineBasicMaterial({
  color: COLOR
});

function createScene(scene, shape) {
  // latitudinal curves
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var geometry = new THREE.Geometry();

    for (var j = 0; j < shape.length; j++) {
      geometry.vertices[j] = shape[j][i];
    }
    var line = new THREE.Line(geometry, material);
    scene.add(line);
  }

  // longitudinal curves
  // TODO: merge these into one nested loop
  shape.forEach(function(s) {
    var geometry = new THREE.Geometry();
    geometry.vertices = s;
    var line = new THREE.Line(geometry, material);
    scene.add(line);
  });
}

camera.position.x = cos(0) * CAMERA_DISTANCE;
camera.position.z = sin(0) * CAMERA_DISTANCE;
function update() {
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

update();

var gui = new dat.GUI({
    height : 5 * 32 - 1
});

function removeChildren(scene, cb) {
  setTimeout(function() {
    scene.remove(scene.children[0]);
    if (!scene.children.length) {
      return (cb||function(){})();
    }

    removeChildren(scene, cb);
  }, 20);
}

var params = {
  clear: function() {
    removeChildren(scene);
  },
  shape: 'sphere'
};

createScene(scene, shapes['sphere']());

var controller = gui.add(params, 'shape', Object.keys(shapes) );
controller.onFinishChange(function(value) {
  removeChildren(scene, function() {
    createScene(scene, shapes[value]());
  });
});

gui.add(params, 'clear').name('Clear');

(function() {

  rotation = 0;
  yRotation = 0;
  // zoom
  Mousetrap.bind('=', function() {
    if (CAMERA_DISTANCE < (DRAW_DISTANCE - 2*SPACING)) {
      CAMERA_DISTANCE += 10;
    }
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.z = sin( rotation ) * CAMERA_DISTANCE;
  });

  Mousetrap.bind('-', function() {
    if (CAMERA_DISTANCE > 10) {
      CAMERA_DISTANCE -= 10;
    }
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.z = sin( rotation ) * CAMERA_DISTANCE;
  });

  // rotation
  Mousetrap.bind('down', function() {
    rotation += 0.05
    yRotation += 0.05
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.y = sin( yRotation ) * CAMERA_DISTANCE;
  });

  Mousetrap.bind('up', function() {
    rotation -= 0.05
    yRotation -= 0.05
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.y = sin( yRotation ) * CAMERA_DISTANCE;
  });

  Mousetrap.bind('left', function() {
    rotation -= 0.05
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.z = sin( rotation ) * CAMERA_DISTANCE;
  });

  Mousetrap.bind('right', function() {
    rotation += 0.05
    camera.position.x = cos( rotation ) * CAMERA_DISTANCE;
    camera.position.z = sin( rotation ) * CAMERA_DISTANCE;
  });

})();
