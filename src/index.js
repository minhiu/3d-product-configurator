import _ from "lodash";
import * as THREE from "three";
import WebGL from "./modules/WebGL";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import '@easylogic/colorpicker/dist/colorpicker.css'
import {ColorPicker} from '@easylogic/colorpicker' 

let scene, camera, renderer, controls, gridHelper, light, colorPicker;
let model, chosenModel = 'tin';
let isMinimized = false;

/** Initialize all instances */
const init = async () => {
  // Check WebGL Availability
  if (!WebGL.isWebGLAvailable()) {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
    throw new Error(warning);
  }

  // Init Scene
  scene = new THREE.Scene();

  // Init Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 200, 200);

  // Init Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);
  renderer.setClearColor(0xffffff, 1);

  // Orbit Control
  controls = new OrbitControls(camera, renderer.domElement);
  
  // Grid
  gridHelper = new THREE.GridHelper(250, 10, 0xC9FDD7, 0xC9FDD7);
  scene.add(gridHelper);

  // Lighting
  light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1);
  scene.add( light );

  // Color Picker
  colorPicker = new ColorPicker({
    type: 'palette',
    position: 'inline',
    container: document.querySelector(".color-picker"),
    edit: false,
    onChange: c => onChangeModelColor(c),
  })
  colorPicker.setUserPalette([
    {
      name: '',
      colors: ['#FFFFFF', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',  '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',  '#795548', '#9E9E9E', '#607D8B'],
    }
  ]);
  $('.color-sets-choose-btn').css('display', 'none');
  $('.color-list').css('margin-right', '0');
  $('.color-list').css('margin-top', '-10px');

  // 3D Model
  await loadGLTFModel(`${process.env.URL}/assets/3d-models/tin.gltf`);

  // Event Listner
  window.addEventListener( 'resize', onWindowResize );
  $('#models').change(onChangeModel);
  $('#rotate-checkbox').change(onChangeRotation);
  $('#minimizeBtn').click(() => {
    if (isMinimized) {
      $('#leftBar').css("left", "0");
      $('#minimizeBtn').css("left", "300px");
      $('#minimizeBtn').css("transform", "rotate(0deg)");
      
    } else {
      $('#leftBar').css("left", "-300px");
      $('#minimizeBtn').css("left", "0");
      $('#minimizeBtn').css("transform", "rotate(180deg)");
    }
    isMinimized = !isMinimized;
  });
  $('#userModel').change(onModelUpload);
};

/** Animate the object */
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  render();
};

/** Render the object */
const render = () => {
  renderer.render(scene, camera);
};

/** Load 3D GLTF Model */
const loadGLTFModel = async (path) => {
  let blob = await fetch(path).then(r => r.blob());
  let newBlob = await readFileAsync(blob);
  let url = window.URL.createObjectURL(newBlob);
  
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const material = new THREE.MeshPhongMaterial({ color: 0x4CAF50 });
  model = gltf.scene.children[0];
  model.material = material;
  model.scale.set(1, 1, 1);
  model.rotateX(Math.PI / 2);
  
  if (path.includes("tin"))
    model.position.set(-50, 0, -80);
  else if (path.includes("airtight-jar")) {
    model.position.set(57, 0, -25);
    model.rotateZ(Math.PI / 2);
  }
  else if (path.includes("jar"))
    model.position.set(-50, 0, -50);
  else if (path.includes("chapstick"))
    model.position.set(-10, 0, -45);
  else if (path.includes("pre-roll-tube"))
    model.position.set(-15, 0, -45);
  else if (path.includes("skincare-bottle"))
    model.position.set(-17, 0, -20);

  scene.add(model);
};

/** Load Blob Async */
const readFileAsync = blob => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      let arrayBuffer = new Uint8Array(reader.result);
      arrayBuffer[2] = arrayBuffer[3] = arrayBuffer[4] = arrayBuffer[5] = 32;
      let newBlob = new Blob([new Uint8Array(arrayBuffer)]);
      resolve(newBlob);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(blob);
  })
}

/** On Change Model Color Event Handler */
const onChangeModelColor = color => {
  model.material = new THREE.MeshPhongMaterial({ color: new THREE.Color(toHexString(color)) });
};

/** On Change Rotation Checkbox Event Handler */
const onChangeRotation = () => {
  const checked = $('#rotate-checkbox')[0].checked;
  controls.autoRotate = checked ? true : false;
}

const toHexString = hex => {
  return parseInt(hex.replace(/^#/, '0x'), 16);
}

/** On Change Model Event Handler */
const onChangeModel = e => {
  const newModel = $('#models')[0].value;

  if (chosenModel === newModel) return;

  scene.remove(model);
  switch (newModel) {
    case "tin":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/tin.gltf`);
      break;
    case "airtight-jar":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/airtight-jar.gltf`);
      break;
    case "jar":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/jar.gltf`);
      break;
    case "chapstick":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/chapstick.gltf`);
      break;
    case "pre-roll-tube":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/pre-roll-tube.gltf`);
      break;
    case "skincare-bottle":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/skincare-bottle.gltf`);
      break;
  }

  chosenModel = newModel;
}

/** On Upload Model Event Handler */
const onModelUpload = e => {
  const userModel = e.target.files[0];
  const userModelURL = URL.createObjectURL(userModel);
  loadGLTFModel(userModelURL);
}

/** On Resize */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
