import { GLTFLoader } from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
const THREE = window.MINDAR.FACE.THREE;

let glassesModel = null;
let anchor = null;
let mindarThree = null;

export const glassesOptions = {
  "glasses1": {
  file: "../assets/models/glasses1/scene.gltf",
    position: [0, -0.05, 0.05],
    scale: [0.43, 0.43, 0.43],
    rotation: [0, 0, 0]
  },
  "glasses2": {
      file: "../assets/models/glasses2/scene.gltf",
      position: [0, -0.4, 0.05],  // adjust Y to fit better
      scale: [0.08, 0.08, 0.08],   // smaller scale
      rotation: [0, Math.PI / 2, 0]  // same rotation
  },
  "glasses3": {
  file: "../assets/models/glasses3/scene.gltf",
    position: [0, -0.2, 0.05],
    scale: [0.7, 0.7, 0.7],
    rotation: [0, 0, 0]
  },
  "glasses4": {
  file: "../assets/models/glasses4/scene.gltf",
    position: [0, -0.25, 0.05],
    scale: [0.22, 0.22, 0.22],
    rotation: [0, 0, 0]
  },
    "glasses5": {
      file: "../assets/models/glasses5/scene.gltf",
    position: [0, -0.05, 0.05],
    scale: [0.45, 0.45, 0.45],
    rotation: [0, 0, 0]
    },
  "glasses6": {
  file: "../assets/models/glasses6/scene.gltf",
    position: [-0.26, 0.15, 0.05],
    scale: [0.2, 0.2, 0.2],
    rotation: [0, 0, 0]
  },
  "glasses7": {
  file: "../assets/models/glasses7/scene.gltf",
    position: [0, -0.05, 0.05],
    scale: [0.47, 0.47, 0.47],
    rotation: [0, 0, 0]
  },
  "glasses8": {
  file: "../assets/models/glasses8/scene.gltf",
    position: [0, -0.05, 0.05],
    scale: [0.11, 0.11, 0.11],
    rotation: [0, 0, 0]
  }
};

const loader = new GLTFLoader();

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });

    const { renderer, scene, camera } = mindarThree;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 1, 1);
    const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight.position.set(0, 10, 10);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    anchor = mindarThree.addAnchor(168);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Get the selected model from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedModel = urlParams.get("model") || "glasses1"; // fallback to glasses1
    updateGlasses(selectedModel);
  };

  start();
});

export const updateGlasses = async (shapeKey) => {
  const config = glassesOptions[shapeKey];
  if (!config) {
    console.warn(`No model config found for: ${shapeKey}`);
    return;
  }

  const { file, position, scale, rotation } = config;

  if (glassesModel) {
    anchor.group.remove(glassesModel);
    glassesModel.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    glassesModel = null;
  }

  return new Promise((resolve, reject) => {
    loader.load(file, (gltf) => {
      glassesModel = gltf.scene;
      glassesModel.position.set(...position);
      glassesModel.scale.set(...scale);
      glassesModel.rotation.set(...rotation);
      anchor.group.add(glassesModel);
      resolve();
    }, undefined, (error) => {
      console.error('Error loading model:', error);
      reject(error);
    });
  });
};
