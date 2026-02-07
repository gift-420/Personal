// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Geometry (electronics-style)
const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 160, 32);

// Material
const material = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  metalness: 0.7,
  roughness: 0.25
});

// Mesh
const knot = new THREE.Mesh(geometry, material);
scene.add(knot);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const pointLight = new THREE.PointLight(0x00ccff, 1.2);
pointLight.position.set(4, 4, 6);
scene.add(pointLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  knot.rotation.x += 0.002;
  knot.rotation.y += 0.003;

  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
