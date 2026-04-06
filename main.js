import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// ─────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa5b8c7);

// ─────────────────────────────────────────────
// RENDERER
// ─────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
document.body.appendChild(renderer.domElement);

// ─────────────────────────────────────────────
// CAMERA
// ─────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.67, 1.4, 6);
camera.lookAt(0.67, 1.75, -0.02);

// ─────────────────────────────────────────────
// ORBIT CONTROLS
// ─────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0.67, 1.75, -0.02);
controls.minDistance = 1;
controls.maxDistance = 60;  // 之前是25，改大就能拉出来了
controls.maxPolarAngle = Math.PI * 0.85;

// ─────────────────────────────────────────────
// TEXTURE LOADER
// ─────────────────────────────────────────────
const texLoader = new THREE.TextureLoader();

const wallTex = texLoader.load("./wall.jpg", (t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
});


const floorTex = texLoader.load("./floor.jpg", (t) => {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 5);
});

// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
const roomW = 11.5;   // x
const roomH = 4.2;    // y
const roomD = 12.0;   // z
const cx = 0.67;
const cy = 1.75;
const cz = -0.02;

const floorGeo = new THREE.PlaneGeometry(roomW, roomD);
const floorMat = new THREE.MeshStandardMaterial({
  map: floorTex,
  roughness: 0.9,
  metalness: 0.0,
    side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.set(cx, cy - roomH / 2, cz);
floor.receiveShadow = true;
scene.add(floor);

const ceilMat = new THREE.MeshStandardMaterial({
  map: wallTex,
  roughness: 1.0,
  side: THREE.DoubleSide,
});

const ceil = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilMat);
ceil.rotation.x = Math.PI / 2;
ceil.position.set(cx, cy + roomH / 2, cz);
scene.add(ceil);


const wallMatInner = new THREE.MeshStandardMaterial({
  map: wallTex,
  roughness:1.0,
  side: THREE.DoubleSide,
});


const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMatInner);
backWall.position.set(cx, cy, cz - roomD / 2);
backWall.receiveShadow = true;
scene.add(backWall);

const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMatInner);
frontWall.position.set(cx, cy, cz + roomD / 2);
frontWall.rotation.y = Math.PI;
frontWall.receiveShadow = true;
scene.add(frontWall);


const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMatInner);
leftWall.position.set(cx - roomW / 2, cy, cz);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);


const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMatInner);
rightWall.position.set(cx + roomW / 2, cy, cz);
rightWall.rotation.y = -Math.PI / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);


// ─────────────────────────────────────────────
// LIGHTING
// ─────────────────────────────────────────────
const ambLight = new THREE.AmbientLight(0xc8d0e0, 0.4);
scene.add(ambLight);

const mainLight = new THREE.PointLight(0xfff5e0, 2.5, 20);
mainLight.position.set(cx, cy + roomH / 2 - 0.3, cz);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.bias = -0.001;
scene.add(mainLight);


const frontLight = new THREE.PointLight(0xfff0cc, 1.5, 12);
frontLight.position.set(cx, cy + roomH / 2 - 0.3, cz - roomD * 0.3);
frontLight.castShadow = true;
frontLight.shadow.mapSize.width = 1024;
frontLight.shadow.mapSize.height = 1024;
scene.add(frontLight);

const windowLight = new THREE.DirectionalLight(0x8899cc, 0.4);
windowLight.position.set(cx + roomW, cy + 2, cz);
scene.add(windowLight);

// ─────────────────────────────────────────────
// VIDEO TEXTURE GROUND
// ─────────────────────────────────────────────
const video = document.createElement("video");
video.src = "./ocean.mp4";
video.loop = true;
video.muted = true;    
video.autoplay = true;
video.play();

const videoTex = new THREE.VideoTexture(video);
videoTex.wrapS = videoTex.wrapT = THREE.RepeatWrapping;
videoTex.repeat.set(1, 1);

const groundMat = new THREE.MeshStandardMaterial({
  map: videoTex,
  roughness: 0.1,
  metalness: 0.5,
  envMapIntensity: 1.5,
});

const rgbeLoader = new RGBELoader();

rgbeLoader.load("./sky.exr", (hdrTex) => {
  hdrTex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdrTex;
  scene.environment = hdrTex;
  groundMat.envMap = hdrTex;  
  groundMat.needsUpdate = true;
});

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  groundMat
);

ground.rotation.x = -Math.PI / 2;
ground.position.set(cx, cy - roomH / 2 - 0.01, cz);
ground.receiveShadow = true;
scene.add(ground);

renderer.toneMappingExposure = 1.5;
// ─────────────────────────────────────────────
const bulbMat = new THREE.MeshStandardMaterial({
  color: 0xffffee,
  emissive: 0xffffaa,
  emissiveIntensity: 1.0,
  roughness: 0.0,
  metalness: 0.8,
});
// ─────────────────────────────────────────────
// 吊灯函数 — 圆柱灯罩 + 细线 + 灯泡
// ─────────────────────────────────────────────
function makePendantLight(x, y, z) {
  const group = new THREE.Group();

  // 细线（从天花板垂下来）
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.6, 8),
    cordMat
  );
  cord.position.y = 0.3; // 线在灯罩上方
  group.add(cord);

  // 圆柱灯罩 — 金属材质 ✅ MeshStandardMaterial metalness
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x888880,
    roughness: 0.2,
    metalness: 0.9,
    side: THREE.DoubleSide,
  });
  const shade = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.2, 0.25, 16, 1, true), // open-ended
    shadeMat
  );
  shade.position.y = -0.05;
  shade.castShadow = true;
  group.add(shade);

  // 灯泡（发光）
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xffffee,
    emissive: 0xffffaa,
    emissiveIntensity: 1.5,
    roughness: 0.0,
    metalness: 0.0,
  });
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    bulbMat
  );
  bulb.position.y = -0.1;
  group.add(bulb);

  // 把整个组放到天花板下
  group.position.set(x, y, z);
  scene.add(group);
}

// 两盏吊灯 — 天花板位置 y = cy + roomH/2 - 0.6（留出线的长度）
const ceilY = cy + roomH / 2 - 0.6;
makePendantLight(cx, ceilY, cz);                    // 教室中间
makePendantLight(cx, ceilY, cz - roomD * 0.3);      // 靠近黑板

// ─────────────────────────────────────────────
// LOAD GLB
// ─────────────────────────────────────────────
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
loader.setDRACOLoader(dracoLoader);

loader.load(
  "./classroom.glb",
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log("✅ classroom loaded");
  },
  (progress) => {
    const pct = Math.round((progress.loaded / progress.total) * 100);
    console.log(`loading... ${pct}%`);
  },
  (error) => {
    console.error("❌ error:", error);
  }
);

// ─────────────────────────────────────────────
// RESIZE
// ─────────────────────────────────────────────
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// ─────────────────────────────────────────────
// WASD
// ─────────────────────────────────────────────
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

function handleMovement() {
  const speed = 0.05;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

  if (keys["w"]) {
    camera.position.addScaledVector(dir, speed);
    controls.target.addScaledVector(dir, speed);
  }
  if (keys["s"]) {
    camera.position.addScaledVector(dir, -speed);
    controls.target.addScaledVector(dir, -speed);
  }
  if (keys["a"]) {
    camera.position.addScaledVector(right, -speed);
    controls.target.addScaledVector(right, -speed);
  }
  if (keys["d"]) {
    camera.position.addScaledVector(right, speed);
    controls.target.addScaledVector(right, speed);
  }
}
// ─────────────────────────────────────────────
// DRAW LOOP
// ─────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  handleMovement();
  controls.update();
  renderer.render(scene, camera);
}

animate();


