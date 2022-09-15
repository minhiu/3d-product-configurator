import _ from "lodash";
import * as THREE from "three";
import WebGL from "./modules/WebGL";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorPicker from "simple-color-picker";

let scene, camera, renderer, controls, gridHelper, light, colorPicker;
let model, modelColor, chosenModel = 'tin';
let isMinimized = false;

/** Initialize all instances */
const init = () => {
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
  renderer.setClearColor(0x65c4a8, 1);

  // Orbit Control
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;

  // Grid
  gridHelper = new THREE.GridHelper(250, 10, 0xf1f1f1, 0xf1f1f1);
  scene.add(gridHelper);

  // Lighting
  light = new THREE.HemisphereLight( 0xffffff, 0x65c4a8, 1 );
  scene.add( light );

  // Color Picker
  colorPicker = new ColorPicker({color: "#9CB4CC"});
  colorPicker.appendTo(document.querySelector(".color-picker"));

  // 3D Model
  loadGLTFModel(`${process.env.URL}/assets/3d-models/tin.gltf`);

  // Event Listner
  window.addEventListener( 'resize', onWindowResize );
  $('#colorBtn').click(onClickSubmitColor);
  $('#modelBtn').click(onClickSubmitModel);

  colorPicker.onChange((e) => {
    modelColor = e;
    $("#colorInput").val(modelColor);
  });

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
const loadGLTFModel = (path) => {
  const loader = new GLTFLoader();
  loader.load(
    path,
    (gltf) => {
      const material = new THREE.MeshPhongMaterial({ color: 0x9CB4CC });
      model = gltf.scene.children[0];
      model.material = material;
      model.scale.set(1, 1, 1);
      model.rotateX(Math.PI / 2);
      
      if (path.includes("tin"))
        model.position.set(-55, -37, -80);
      else if (path.includes("jar"))
        model.position.set(-50, 0, -50);
      else if (path.includes("chapstick"))
        model.position.set(-10, 0, -45);
      else if (path.includes("pre-roll-tube"))
        model.position.set(-15, 0, -45);
      else if (path.includes("skincare-bottle"))
        model.position.set(-17, 0, -20);

      scene.add(model);    
    },
    undefined,
    (err) => {
      console.log(error(err));
    }
  );
};

/** Color Submit Form */
const onClickSubmitColor = e => {
  modelColor = validateHexString($('#colorInput').val());

  if (colorPicker.getHexString() !== modelColor) {
    colorPicker.setColor(modelColor);
  }
  $('#colorInput').val(modelColor);
  model.material = new THREE.MeshPhongMaterial({ color: new THREE.Color(modelColor) });
};

/** Models Submit Form */
const onClickSubmitModel = e => {
  const newModel = $('#models')[0].value;

  if (chosenModel === newModel) return;

  scene.remove(model);
  switch (newModel) {
    case "tin":
      loadGLTFModel(`${process.env.URL}/assets/3d-models/tin.gltf`);
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

/** On Resize */
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/** Validate color hexstring */
const validateHexString = (hex) => {
  let newHex = hex;

  if (hex[0] !== "#" && hex.length === 6) {
    newHex = "#" + hex;
  } else if (hex.length !== 7) {
    newHex = "#9CB4CC";
    alert("Wrong Hex String. Please use this format: '#FFFFFF' ");
  }
  return newHex;
}

init();
animate();
