import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity = new THREE.Vector3();
let prevTime = performance.now();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Licht
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Map laden
  const loader = new GLTFLoader();
  loader.load('abandoned_city.glb', function(gltf){
    scene.add(gltf.scene);
  }, undefined, function(error){
    console.error(error);
  });

  // PointerLock Controls für FPS-Kamera
  controls = new PointerLockControls(camera, document.body);

  document.body.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    document.getElementById('overlay').style.display = 'none';
  });

  controls.addEventListener('unlock', () => {
    document.getElementById('overlay').style.display = '';
  });

  scene.add(controls.getObject());

  // Movement-Events
  const onKeyDown = function(event){
    switch(event.code){
      case 'KeyW': moveForward = true; break;
      case 'KeyA': moveLeft = true; break;
      case 'KeyS': moveBackward = true; break;
      case 'KeyD': moveRight = true; break;
    }
  };

  const onKeyUp = function(event){
    switch(event.code){
      case 'KeyW': moveForward = false; break;
      case 'KeyA': moveLeft = false; break;
      case 'KeyS': moveBackward = false; break;
      case 'KeyD': moveRight = false; break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  if(moveForward) velocity.z -= 400.0 * delta;
  if(moveBackward) velocity.z += 400.0 * delta;
  if(moveLeft) velocity.x -= 400.0 * delta;
  if(moveRight) velocity.x += 400.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  prevTime = time;

  renderer.render(scene, camera);
}
