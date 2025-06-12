// main.js
import { loadTexture } from "../libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

let glassesPlane = null;
let anchor = null;

// Glasses options
export const glassesOptions = {
  "round": {
    file: "../assets/facemesh/round.png",
    position: [0, -0.2, 0.05],
    scale: [2.7, 1.5]
  },
  "rectangle": {
    file: "../assets/facemesh/rectangle.png",
    position: [0, -0.2, 0.05],
    scale: [2.6, 1.5]
  },
  "square": {
    file: "../assets/facemesh/square.png",
    position: [0, -0.2, 0.05],
    scale: [2.6, 1.5]
  },
  "semi-rimless": {
    file: "../assets/facemesh/semi-rimless.png",
    position: [0, -0.2, 0.05],
    scale: [2.6, 1.5]
  }
};

// Audio map for glasses selection
const audioMap = {
  "round": new Audio("../assets/audio/round.mp3"),
  "rectangle": new Audio("../assets/audio/rectangle.mp3"),
  "square": new Audio("../assets/audio/square.mp3"),
  "semi-rimless": new Audio("../assets/audio/semi-rimless.mp3"),
};

// Welcome audio
const welcomeAudio = new Audio("../assets/audio/welcome.mp3");

// Preload all audio
Object.values(audioMap).forEach(audio => audio.load());
welcomeAudio.load();

let welcomePlayed = false;

const tryPlayWelcome = () => {
  if (welcomePlayed) return;

  welcomePlayed = true;
  welcomeAudio.play().catch((err) => {
    console.warn("Autoplay blocked. Waiting for user interaction.");
    // If autoplay fails, wait for user click
    document.body.addEventListener("click", () => {
      welcomeAudio.play().catch(() => {});
    }, { once: true });
  });
};

// Check if autoplay is allowed
if (sessionStorage.getItem("allowAutoplay") === "true") {
  sessionStorage.removeItem("allowAutoplay");
  window.addEventListener("DOMContentLoaded", tryPlayWelcome);
} else {
  document.body.addEventListener("click", tryPlayWelcome, { once: true });
}



// Play audio safely
const playAudio = (type) => {
  // Stop welcome audio if playing
  welcomeAudio.pause();
  welcomeAudio.currentTime = 0;

  // Stop any other audio
  Object.values(audioMap).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });

  const audio = audioMap[type];
  audio.play().catch((e) => {
    console.warn("Audio play failed:", e);
  });
};


document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });

    const { renderer, scene, camera } = mindarThree;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 1, 1);
    const pointLight = new THREE.PointLight(0xffffff, 0.6, 100);
    pointLight.position.set(0, 10, 10);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    // Face anchor
    anchor = mindarThree.addAnchor(168);

    // Start AR engine
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    // Default glasses
    updateGlasses("semi-rimless");
  };

  start();

  // Button click listeners using data-shape
  document.querySelectorAll("button[data-shape]").forEach(button => {
    button.addEventListener("click", () => {
      const shape = button.getAttribute("data-shape");
      updateGlasses(shape);
      playAudio(shape);
    });
  });
});

// Glasses updater
export const updateGlasses = async (shapeKey) => {
  const { file, position, scale } = glassesOptions[shapeKey];
  const texture = await loadTexture(file);

  if (glassesPlane) {
    anchor.group.remove(glassesPlane);
    glassesPlane.geometry.dispose();
    glassesPlane.material.dispose();
  }

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 0x000000
  });

  glassesPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(scale[0], scale[1]),
    material
  );

  glassesPlane.position.set(...position);
  anchor.group.add(glassesPlane);
};
