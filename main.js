// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 7;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Circuit geometry
const geoOuter = new THREE.IcosahedronGeometry(2.2, 2);
const matOuter = new THREE.MeshBasicMaterial({
  color: 0x00d4ff,
  wireframe: true,
  transparent: true,
  opacity: 0.45
});
const circuitOuter = new THREE.Mesh(geoOuter, matOuter);
scene.add(circuitOuter);

const geoInner = new THREE.OctahedronGeometry(1.2, 1);
const matInner = new THREE.MeshBasicMaterial({
  color: 0x00aacc,
  wireframe: true,
  transparent: true,
  opacity: 0.25
});
const circuitInner = new THREE.Mesh(geoInner, matInner);
scene.add(circuitInner);

// Light
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// Mouse
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Logo
const logo = document.querySelector(".site-logo img");

// Pulse clock
let t = 0;

// Animation
function animate() {
  requestAnimationFrame(animate);
  t += 0.02;

  circuitOuter.rotation.x += 0.0012;
  circuitOuter.rotation.y += 0.0016;
  circuitInner.rotation.x -= 0.001;
  circuitInner.rotation.y -= 0.0014;

  circuitOuter.rotation.z = Math.sin(t) * 0.15;
  circuitInner.rotation.z = -Math.sin(t + 1.5) * 0.12;

  matOuter.opacity = 0.35 + Math.sin(t) * 0.15;
  matInner.opacity = 0.2 + Math.sin(t + 1.5) * 0.1;

  if (logo) {
    logo.style.transform = `translate(${mouseX * 6}px, ${mouseY * 6}px)`;
  }

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Menu
const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

menuBtn.onclick = () => menuOverlay.classList.add("active");
menuClose.onclick = () => menuOverlay.classList.remove("active");
