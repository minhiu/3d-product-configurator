import _ from "lodash";
import * as THREE from "three";
import WebGL from "./modules/WebGL";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

if (WebGL.isWebGLAvailable()) {
  // Init Scene
  const scene = new THREE.Scene();
  
  // Init Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 200, 200);

  // Init Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.setClearColor(0x65c4a8, 1);
  
  // Orbit Control
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;

  // Grid
  const gridHelper = new THREE.GridHelper(250, 10, 0xf1f1f1, 0xf1f1f1);
  scene.add(gridHelper);

  // Lighting
  const lightA = new THREE.AmbientLight(0xf0f0f0);
  scene.add(lightA);
  
  const lightP = new THREE.PointLight(0xeeeeee, 2);
  lightP.position.set(1000, 1000, 1000);
  scene.add(lightP);

  // GLTF Loader
  const loader = new GLTFLoader();
  loader.load('./assets/3d-models/tpc-cr-tin-v2a-bottom.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    scene.add(model);
    animate();
  }), undefined, (err) => {
    console.log(error(err));
  };

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}
