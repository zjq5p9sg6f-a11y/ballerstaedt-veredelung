// @ts-nocheck
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// ============================================================
//  PROCEDURAL PRÄGUNGS-PATTERNS · BaCo-konforme Strukturen
//  Generiert Normal-Maps direkt im Browser via Canvas-API.
//  Vorteil: keine externen Assets, instant-load, lizenzfrei.
// ============================================================

function generatePatternHeightmap(
  type: string,
  size: number = 512,
  scale: number = 1.0
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  const cell = Math.max(8, Math.round(24 * scale));

  switch (type) {
    case "leinen-damast": {
      // Kreuz-Webemuster aus dünnen Linien — Leinen-Optik
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.3;
      ctx.lineCap = "round";
      const step = cell * 0.7;
      for (let y = 0; y < size; y += step * 2) {
        ctx.beginPath();
        for (let x = 0; x < size; x += step * 2) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + step, y);
          ctx.moveTo(x + step, y + step);
          ctx.lineTo(x + step * 2, y + step);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "#cccccc";
      for (let x = 0; x < size; x += step * 2) {
        ctx.beginPath();
        for (let y = 0; y < size; y += step * 2) {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + step);
          ctx.moveTo(x + step, y + step);
          ctx.lineTo(x + step, y + step * 2);
        }
        ctx.stroke();
      }
      break;
    }
    case "puenktchen": {
      // Reguläres Punktraster
      const r = cell * 0.3;
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      for (let y = cell / 2; y < size; y += cell) {
        for (let x = cell / 2; x < size; x += cell) {
          ctx.save();
          ctx.translate(x, y);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(1, "#000000");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      break;
    }
    case "nadelstich": {
      // Feines, zufälliges Nadelmuster
      const r = cell * 0.18;
      ctx.fillStyle = "#ffffff";
      const seed = 42;
      let s = seed;
      const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      const count = (size * size) / (cell * cell) * 1.5;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "diamant-grob":
    case "diamant-fein": {
      // Diamant-Raster (rotiertes Quadrat-Raster)
      const c2 = type === "diamant-fein" ? cell * 0.7 : cell * 1.4;
      ctx.fillStyle = "#ffffff";
      for (let y = 0; y < size + c2; y += c2) {
        for (let x = 0; x < size + c2; x += c2) {
          const offset = (Math.floor(y / c2) % 2) * c2 / 2;
          ctx.save();
          ctx.translate(x + offset, y);
          ctx.rotate(Math.PI / 4);
          const half = c2 * 0.32;
          const g = ctx.createLinearGradient(-half, -half, half, half);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(0.5, "#888888");
          g.addColorStop(1, "#000000");
          ctx.fillStyle = g;
          ctx.fillRect(-half, -half, half * 2, half * 2);
          ctx.restore();
        }
      }
      break;
    }
    case "wuermchen": {
      // Würmchen — geschwungene Kurven
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.4;
      ctx.lineCap = "round";
      const seed = 17;
      let s = seed;
      const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
      for (let i = 0; i < (size * size) / (cell * cell * 4); i++) {
        const x = rand() * size;
        const y = rand() * size;
        const length = cell * (1.5 + rand() * 1.5);
        const angle = rand() * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(angle) * length * 0.5 + (rand() - 0.5) * cell,
          y + Math.sin(angle) * length * 0.5 + (rand() - 0.5) * cell,
          x + Math.cos(angle) * length,
          y + Math.sin(angle) * length
        );
        ctx.stroke();
      }
      break;
    }
    case "schriftzug": {
      // Geschwungene Linien (kalligrafisch — fortlaufend Streuprägung)
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.25;
      ctx.lineCap = "round";
      for (let y = cell; y < size; y += cell * 2.2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < size; x += 4) {
          const wave = Math.sin(x / cell) * cell * 0.3;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      break;
    }
    case "wabe": {
      // Honigwaben (Hexagon-Raster)
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = cell * 0.15;
      const r = cell * 0.7;
      const w = r * Math.sqrt(3);
      const h = r * 1.5;
      for (let row = 0; row < size / h + 1; row++) {
        for (let col = 0; col < size / w + 1; col++) {
          const cx = col * w + (row % 2 ? w / 2 : 0);
          const cy = row * h;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i + Math.PI / 6;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      break;
    }
    default:
      // glatt
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, size, size);
  }

  // Leichte Gauss-Blur via Canvas-Filter für glattere Übergänge
  const blurred = document.createElement("canvas");
  blurred.width = blurred.height = size;
  const bctx = blurred.getContext("2d");
  bctx.filter = "blur(0.6px)";
  bctx.drawImage(c, 0, 0);
  return blurred;
}

function heightmapToNormalMap(
  source: HTMLCanvasElement,
  strength: number = 2.0
): THREE.CanvasTexture {
  const w = source.width;
  const h = source.height;
  const reader = source.getContext("2d");
  const src = reader.getImageData(0, 0, w, h).data;
  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    height[i] = (0.299 * src[i * 4] + 0.587 * src[i * 4 + 1] + 0.114 * src[i * 4 + 2]) / 255;
  }
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = (x - 1 + w) % w;
      const x1 = (x + 1) % w;
      const y0 = (y - 1 + h) % h;
      const y1 = (y + 1) % h;
      const tl = height[y0 * w + x0], tc = height[y0 * w + x], tr = height[y0 * w + x1];
      const ml = height[y * w + x0], mr = height[y * w + x1];
      const bl = height[y1 * w + x0], bc = height[y1 * w + x], br = height[y1 * w + x1];
      const dx = tr + 2 * mr + br - (tl + 2 * ml + bl);
      const dy = bl + 2 * bc + br - (tl + 2 * tc + tr);
      const nx = -dx * strength;
      const ny = -dy * strength;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const o = i * 4;
      img.data[o] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);  // tile across the foil surface
  tex.needsUpdate = true;
  return tex;
}

const PRAEGUNGEN = [
  { id: "glatt",          label: "Glatt",            ui: "—",    strength: 0   },
  { id: "leinen-damast",  label: "Leinen-Damast",    ui: "LD",   strength: 1.5 },
  { id: "puenktchen",     label: "Pünktchen",        ui: "PÜ",   strength: 2.0 },
  { id: "nadelstich",     label: "Nadelstich",       ui: "NaP",  strength: 1.8 },
  { id: "diamant-grob",   label: "Diamant grob",     ui: "Dia",  strength: 2.5 },
  { id: "diamant-fein",   label: "Diamant fein",     ui: "Perl", strength: 1.6 },
  { id: "wuermchen",      label: "Würmchen",         ui: "WÜ",   strength: 1.8 },
  { id: "schriftzug",     label: "Schriftzug-Streu", ui: "G",    strength: 1.4 },
  { id: "wabe",           label: "Wabe",             ui: "—",    strength: 1.2 },
];

const praegungTextureCache: Record<string, THREE.CanvasTexture | null> = {};

function getPraegungNormalMap(id: string): THREE.CanvasTexture | null {
  if (id === "glatt") return null;
  if (praegungTextureCache[id]) return praegungTextureCache[id];
  const cfg = PRAEGUNGEN.find((p) => p.id === id);
  if (!cfg) return null;
  const heightmap = generatePatternHeightmap(id, 512, 1.0);
  const normalMap = heightmapToNormalMap(heightmap, cfg.strength);
  praegungTextureCache[id] = normalMap;
  return normalMap;
}

// ============================================================
//  CATALOG · BaCo-konforme Schemata
// ============================================================
const SHAPES = [
  { id: "ronde",            label: "Ronde",            code: "R" },
  { id: "ronde-lasche",     label: "Ronde · Lasche",   code: "AR" },
  { id: "kappe",            label: "Kappe",            code: "K" },
  { id: "kappe-lasche",     label: "Kappe · Lasche",   code: "AK" },
  { id: "verformt-lasche",  label: "Verformt · Lasche",code: "AL" },
  { id: "verformte-ronde",  label: "Verformt",         code: "—" },
  { id: "induktionssiegel", label: "Induktion",        code: "IR" },
  { id: "baco-bond",        label: "BaCo Bond",        code: "PSL" },
];

const MATERIALS = [
  { id: "alu_g",  label: "Alu glänzend", color: 0xd8d8d8, metalness: 0.92, roughness: 0.18, ui: "#d8d8d8" },
  { id: "alu_m",  label: "Alu matt",     color: 0xbdbdbd, metalness: 0.55, roughness: 0.6,  ui: "#bdbdbd" },
  { id: "kunst",  label: "Kunststoff",   color: 0xf6f6f4, metalness: 0.0,  roughness: 0.65, ui: "#f6f6f4" },
  { id: "gold",   label: "Gold-Lack",    color: 0xd4af37, metalness: 1.0,  roughness: 0.15, ui: "#d4af37" },
  { id: "silber", label: "Silber-Lack",  color: 0xcfd6dd, metalness: 1.0,  roughness: 0.1,  ui: "#cfd6dd" },
  { id: "kupfer", label: "Kupfer-Lack",  color: 0xb87333, metalness: 1.0,  roughness: 0.18, ui: "#b87333" },
];

// ============================================================
//  STATE
// ============================================================
const state = {
  shape: "ronde",
  diameter: 95,
  material: "alu_g",
  praegung: "glatt",
  logoDataUrl: null,
  embossingMode: false,
  embossStrength: 4,
};

let foilGroup = null;
let logoDiffuseTexture = null;
let logoNormalMap = null;

// ============================================================
//  THREE.JS SETUP
// ============================================================
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
camera.position.set(0, 0.55, 2.6);

const pmrem = new THREE.PMREMGenerator(renderer);
// Premium HDR-Environment (von ObjectCode public S3, gleiches wie K3 selbst nutzt)
new THREE.TextureLoader().load(
  "https://oc-k3.s3.eu-central-1.amazonaws.com/libs/3d/environments/apartment.hdr",
  () => {},
  undefined,
  () => {
    // Fallback auf prozedurales RoomEnvironment falls HDR nicht ladbar
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }
);
// Sofort-Fallback während HDR lädt
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(2.5, 4, 3);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffe4b5, 0.4);
fillLight.position.set(-3, 1, -2);
scene.add(fillLight);

// Reflection floor
const floorGeo = new THREE.CircleGeometry(2.4, 64);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1c, metalness: 0.6, roughness: 0.4,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;
scene.add(floor);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI / 2.05;
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 5;
controls.target.set(0, 0.05, 0);

// ============================================================
//  GEOMETRY BUILDERS  (9 BaCo-Formen)
// ============================================================
const MM = 0.01;  // 1 mm = 0.01 scene-units

function laschePath(shape, edgeR, side = "right") {
  // Trapez-Lasche, 18mm × 14mm, gerundete Außenkante
  const w = 14 * MM, h = 18 * MM;
  const sx = side === "right" ? edgeR : -edgeR;
  const dir = side === "right" ? 1 : -1;
  shape.moveTo(sx, -w / 2);
  shape.lineTo(sx + dir * h * 0.6, -w / 2 * 0.85);
  shape.quadraticCurveTo(sx + dir * h, 0, sx + dir * h * 0.6, w / 2 * 0.85);
  shape.lineTo(sx, w / 2);
}

function rondeShape(diameter, withLasche = false) {
  const r = (diameter / 2) * MM;
  const shape = new THREE.Shape();
  const segs = 96;
  if (withLasche) {
    // Ring with lasche extension
    const angleStart = Math.asin((14 * MM / 2) / r) || 0.08;
    shape.absarc(0, 0, r, angleStart, 2 * Math.PI - angleStart, false);
    laschePath(shape, r * Math.cos(angleStart), "right");
    shape.lineTo(r * Math.cos(angleStart), r * Math.sin(angleStart) * -1);
  } else {
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  }
  return new THREE.ShapeGeometry(shape, segs);
}

function ovalShape(diameter, withLasche = false) {
  const w = (diameter / 2) * MM;
  const h = (diameter / 2) * MM * 0.7;
  const shape = new THREE.Shape();
  if (withLasche) {
    const angleStart = 0.18;
    shape.absellipse(0, 0, w, h, angleStart, 2 * Math.PI - angleStart, false, 0);
    laschePath(shape, w * Math.cos(angleStart), "right");
    shape.lineTo(w * Math.cos(angleStart), h * Math.sin(angleStart) * -1);
  } else {
    shape.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
  }
  return new THREE.ShapeGeometry(shape, 96);
}

function buildFlatFoil(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

function buildKappe(diameter, material, withLasche = false) {
  const r = (diameter / 2) * MM;
  const group = new THREE.Group();
  // Kuppel: leichter Half-Sphere abgeflacht
  const sphereGeo = new THREE.SphereGeometry(r, 96, 32, 0, Math.PI * 2, 0, Math.PI / 3.5);
  const sphere = new THREE.Mesh(sphereGeo, material);
  sphere.scale.y = 0.35;  // flachgedrückt
  group.add(sphere);
  // Boden-Disc
  const baseGeo = new THREE.CircleGeometry(r, 96);
  const base = new THREE.Mesh(baseGeo, material);
  base.rotation.x = -Math.PI / 2;
  group.add(base);
  if (withLasche) {
    const laschenShape = new THREE.Shape();
    laschePath(laschenShape, r, "right");
    laschenShape.lineTo(r, -7 * MM);  // close
    const laschenGeo = new THREE.ShapeGeometry(laschenShape, 16);
    const lasche = new THREE.Mesh(laschenGeo, material);
    lasche.rotation.x = -Math.PI / 2;
    group.add(lasche);
  }
  return group;
}

function buildInduktionssiegel(diameter, material) {
  const r = (diameter / 2) * MM;
  const group = new THREE.Group();
  // Disc
  const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 96), material);
  disc.rotation.x = -Math.PI / 2;
  group.add(disc);
  // Innerer Ring (slightly raised) for inductive coil
  const innerR = r * 0.7;
  const ringGeo = new THREE.RingGeometry(innerR * 0.92, innerR, 96);
  const ringMat = material.clone();
  ringMat.color = new THREE.Color(0x8a8a8a);
  ringMat.metalness = Math.min(material.metalness + 0.05, 1);
  ringMat.roughness = Math.max(material.roughness - 0.1, 0.05);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.001;
  group.add(ring);
  return group;
}

function buildBacoBond(diameter, material) {
  const r = (diameter / 2) * MM;
  const group = new THREE.Group();
  // Top: Alu/Material disc
  const top = new THREE.Mesh(new THREE.CircleGeometry(r, 96), material);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.008;
  group.add(top);
  // Below: PSL liner (warmer color, soft)
  const linerMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0e8d8,
    metalness: 0,
    roughness: 0.85,
    side: THREE.DoubleSide,
  });
  const liner = new THREE.Mesh(new THREE.CircleGeometry(r * 0.97, 96), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.001;
  group.add(liner);
  return group;
}

function buildRollenware(diameter, material) {
  const r = (diameter / 2) * MM;
  const len = r * 4;
  const group = new THREE.Group();
  // Rolle (Cylinder)
  const cylGeo = new THREE.CylinderGeometry(r * 0.85, r * 0.85, r * 0.6, 96, 1, true);
  const cyl = new THREE.Mesh(cylGeo, material);
  cyl.rotation.z = Math.PI / 2;
  cyl.position.set(-len * 0.35, r * 0.3, 0);
  group.add(cyl);
  // Cylinder-Endkappen (innerer Hülsenkern)
  const coreMat = new THREE.MeshStandardMaterial({ color: 0xb38e5d, metalness: 0.1, roughness: 0.9 });
  const cap1 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.85, 64), coreMat);
  cap1.rotation.y = Math.PI / 2;
  cap1.position.set(-len * 0.35 + r * 0.301, r * 0.3, 0);
  group.add(cap1);
  const cap2 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.85, 64), coreMat);
  cap2.rotation.y = -Math.PI / 2;
  cap2.position.set(-len * 0.35 - r * 0.301, r * 0.3, 0);
  group.add(cap2);
  // Abrollende Folie (PlaneGeometry)
  const planeGeo = new THREE.PlaneGeometry(len * 0.8, r * 0.6);
  const plane = new THREE.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(len * 0.05, 0, 0);
  group.add(plane);
  return group;
}

// ============================================================
//  MATERIAL FACTORY · Premium PBR
// ============================================================
function makeMaterial(matConfig) {
  const isAlu = matConfig.id.startsWith("alu");
  const isLack = ["gold", "silber", "kupfer"].includes(matConfig.id);

  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(matConfig.color),
    metalness: matConfig.metalness,
    roughness: matConfig.roughness,
    side: THREE.DoubleSide,
    envMapIntensity: 1.6,
    // Premium-Eigenschaften
    clearcoat: isLack ? 0.6 : (isAlu ? 0.15 : 0.25),
    clearcoatRoughness: isLack ? 0.08 : 0.25,
    sheen: matConfig.id === "kunst" ? 0.3 : 0,
    sheenColor: new THREE.Color(0xffffff),
    sheenRoughness: 0.6,
    anisotropy: isAlu ? 0.4 : 0,
    anisotropyRotation: Math.PI / 4,
    iridescence: isLack ? 0.05 : 0,
    iridescenceIOR: 1.3,
  });

  // Strukturprägung als Haupt-Normal-Map auf der Folien-Oberfläche
  const praegungMap = getPraegungNormalMap(state.praegung);
  if (praegungMap) {
    m.normalMap = praegungMap;
    m.normalScale = new THREE.Vector2(0.4, 0.4);
  }

  // Logo-Layer
  if (logoDiffuseTexture) m.map = logoDiffuseTexture;
  // Logo-Normal-Map gewinnt über Strukturprägung (Embossing-Mode)
  if (logoNormalMap) {
    m.normalMap = logoNormalMap;
    m.normalScale = new THREE.Vector2(1.0, 1.0);
  }
  return m;
}

// ============================================================
//  REBUILD FOIL
// ============================================================
function disposeGroup(group) {
  group.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
    if (c.material) {
      if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
      else c.material.dispose();
    }
  });
}

function rebuildFoil() {
  if (foilGroup) {
    scene.remove(foilGroup);
    disposeGroup(foilGroup);
  }

  const matConfig = MATERIALS.find((m) => m.id === state.material);
  const isHotFoil = ["gold", "silber", "kupfer"].includes(state.material);
  const hasLogo = !!state.logoDataUrl && !!logoDiffuseTexture;

  // Hot-Foil-Spot-Modus: Wenn metallisches Material + Logo → Folie wird Alu,
  // Logo wird metallisch (echte Heißfolien-Simulation).
  // Wenn nur Material gewählt ohne Logo → ganze Folie metallisch (Default).
  let mainMaterial;
  if (isHotFoil && hasLogo) {
    const aluBase = MATERIALS.find((m) => m.id === "alu_g");
    // Hauptfolie wird Alu — Logo NICHT als Druck darauf, sondern als Overlay
    const tempLogoDiff = logoDiffuseTexture;
    const tempLogoNorm = logoNormalMap;
    logoDiffuseTexture = null;
    logoNormalMap = state.embossingMode ? tempLogoNorm : null;
    mainMaterial = makeMaterial(aluBase);
    logoDiffuseTexture = tempLogoDiff;
    logoNormalMap = tempLogoNorm;
  } else {
    mainMaterial = makeMaterial(matConfig);
  }

  const d = state.diameter;

  switch (state.shape) {
    case "ronde":            foilGroup = buildFlatFoil(rondeShape(d, false), mainMaterial); break;
    case "ronde-lasche":     foilGroup = buildFlatFoil(rondeShape(d, true),  mainMaterial); break;
    case "kappe":            foilGroup = buildKappe(d, mainMaterial, false); break;
    case "kappe-lasche":     foilGroup = buildKappe(d, mainMaterial, true); break;
    case "verformt-lasche":  foilGroup = buildFlatFoil(ovalShape(d, true),   mainMaterial); break;
    case "verformte-ronde":  foilGroup = buildFlatFoil(ovalShape(d, false),  mainMaterial); break;
    case "induktionssiegel": foilGroup = buildInduktionssiegel(d, mainMaterial); break;
    case "baco-bond":        foilGroup = buildBacoBond(d, mainMaterial); break;
    case "rollenware":       foilGroup = buildRollenware(d, mainMaterial); break;
    default:                 foilGroup = buildFlatFoil(rondeShape(d, false), mainMaterial); break;
  }

  // Hot-Foil-Overlay: Logo wird metallisch in der gewählten Farbe
  if (isHotFoil && hasLogo && !state.embossingMode) {
    addHotFoilOverlay(foilGroup, d, matConfig);
  }

  scene.add(foilGroup);
  updateInfoLabel();
}

function addHotFoilOverlay(group, diameter, matConfig) {
  const r = (diameter / 2) * MM;
  const hotFoilMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(matConfig.color),
    metalness: 1.0,
    roughness: matConfig.roughness * 0.7,
    alphaMap: logoDiffuseTexture,
    map: logoDiffuseTexture,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
    envMapIntensity: 1.8,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
  });

  let overlayGeo = null;
  switch (state.shape) {
    case "ronde":            overlayGeo = rondeShape(diameter, false); break;
    case "ronde-lasche":     overlayGeo = rondeShape(diameter, true);  break;
    case "verformte-ronde":  overlayGeo = ovalShape(diameter, false);  break;
    case "verformt-lasche":  overlayGeo = ovalShape(diameter, true);   break;
    case "induktionssiegel": overlayGeo = new THREE.CircleGeometry(r, 96); break;
    case "baco-bond":        overlayGeo = new THREE.CircleGeometry(r, 96); break;
    case "kappe":
    case "kappe-lasche":     overlayGeo = new THREE.CircleGeometry(r, 96); break;
    case "rollenware":       overlayGeo = new THREE.PlaneGeometry(r * 4 * 0.8, r * 0.6); break;
    default:                 overlayGeo = rondeShape(diameter, false); break;
  }

  const overlay = new THREE.Mesh(overlayGeo, hotFoilMat);
  overlay.rotation.x = -Math.PI / 2;
  // Slightly above the main foil to avoid z-fighting + sells the "stamping" effect
  overlay.position.y = state.shape === "kappe" || state.shape === "kappe-lasche" ? 0.0015 : 0.0009;
  group.add(overlay);
}

function updateInfoLabel() {
  const shape = SHAPES.find((s) => s.id === state.shape);
  const mat = MATERIALS.find((m) => m.id === state.material);
  const isHotFoil = ["gold", "silber", "kupfer"].includes(state.material);
  const hasLogo = !!state.logoDataUrl;
  let veredel = "";
  if (hasLogo) {
    if (state.embossingMode) {
      veredel = " · Blindprägung";
    } else if (isHotFoil) {
      veredel = ` · Logo ${mat.label}`;
    } else {
      veredel = " · Druck";
    }
  }
  const matLabel = isHotFoil && hasLogo ? "Alu glänzend" : mat.label;
  document.getElementById("canvasInfo").innerHTML =
    `<b>${shape.label}</b> ${shape.code !== "—" ? `[${shape.code}]` : ""} · Ø${state.diameter}mm · ${matLabel}${veredel}`;
}

// ============================================================
//  SOBEL FILTER · Logo → Normal Map
// ============================================================
function imageToNormalMapCanvas(img, strength = 4) {
  const w = img.width, h = img.height;
  const reader = document.createElement("canvas");
  reader.width = w; reader.height = h;
  const rctx = reader.getContext("2d");
  rctx.drawImage(img, 0, 0);
  const src = rctx.getImageData(0, 0, w, h).data;

  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = src[i * 4], g = src[i * 4 + 1], b = src[i * 4 + 2];
    const a = src[i * 4 + 3] / 255;
    height[i] = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) * a;
  }

  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  const octx = out.getContext("2d");
  const img2 = octx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = x === 0 ? 0 : x - 1;
      const x1 = x === w - 1 ? w - 1 : x + 1;
      const y0 = y === 0 ? 0 : y - 1;
      const y1 = y === h - 1 ? h - 1 : y + 1;
      const tl = height[y0 * w + x0], tc = height[y0 * w + x], tr = height[y0 * w + x1];
      const ml = height[y * w + x0], mr = height[y * w + x1];
      const bl = height[y1 * w + x0], bc = height[y1 * w + x], br = height[y1 * w + x1];
      const dx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
      const dy = (bl + 2 * bc + br) - (tl + 2 * tc + tr);
      const nx = -dx * strength, ny = -dy * strength, nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const o = i * 4;
      img2.data[o] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      img2.data[o + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      img2.data[o + 2] = Math.round(((nz / len) * 0.5 + 0.5) * 255);
      img2.data[o + 3] = 255;
    }
  }
  octx.putImageData(img2, 0, 0);
  return out;
}

function loadImage(dataUrl) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = dataUrl;
  });
}

async function refreshLogoTextures() {
  if (!state.logoDataUrl) {
    logoDiffuseTexture = null;
    logoNormalMap = null;
    rebuildFoil();
    return;
  }
  const img = await loadImage(state.logoDataUrl);
  // Diffuse
  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = img.width; diffCanvas.height = img.height;
  diffCanvas.getContext("2d").drawImage(img, 0, 0);
  logoDiffuseTexture = new THREE.CanvasTexture(diffCanvas);
  logoDiffuseTexture.colorSpace = THREE.SRGBColorSpace;
  logoDiffuseTexture.needsUpdate = true;
  // Normal Map
  const normCanvas = imageToNormalMapCanvas(img, state.embossStrength);
  logoNormalMap = new THREE.CanvasTexture(normCanvas);
  logoNormalMap.colorSpace = THREE.NoColorSpace;
  logoNormalMap.needsUpdate = true;
  rebuildFoil();
}

// ============================================================
//  UI · BUILD CONTROLS
// ============================================================
const shapePickerEl = document.getElementById("shapePicker");
const shapeIcons = {
  "ronde":            `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.85"/>`,
  "ronde-lasche":     `<circle cx="12" cy="14" r="10" fill="currentColor" opacity="0.85"/><path d="M21 11 l5 3 -5 3 z" fill="currentColor" opacity="0.85"/>`,
  "kappe":            `<ellipse cx="14" cy="18" rx="11" ry="3" fill="currentColor" opacity="0.4"/><path d="M3 18 q11 -16 22 0" fill="currentColor" opacity="0.85"/>`,
  "kappe-lasche":     `<ellipse cx="12" cy="18" rx="10" ry="3" fill="currentColor" opacity="0.4"/><path d="M2 18 q10 -16 20 0" fill="currentColor" opacity="0.85"/><path d="M21 16 l5 2 -5 2 z" fill="currentColor" opacity="0.85"/>`,
  "verformt-lasche":  `<ellipse cx="12" cy="14" rx="10" ry="6" fill="currentColor" opacity="0.85"/><path d="M21 12 l5 2 -5 2 z" fill="currentColor" opacity="0.85"/>`,
  "verformte-ronde":  `<ellipse cx="14" cy="14" rx="11" ry="7" fill="currentColor" opacity="0.85"/>`,
  "induktionssiegel": `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.4"/><circle cx="14" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  "baco-bond":        `<circle cx="14" cy="14" r="11" fill="currentColor" opacity="0.85"/><circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.5"/>`,
};

SHAPES.forEach((s) => {
  const btn = document.createElement("button");
  btn.className = "form-btn" + (s.id === state.shape ? " active" : "");
  btn.dataset.id = s.id;
  btn.innerHTML = `
    <svg viewBox="0 0 28 28">${shapeIcons[s.id] || ""}</svg>
    <div>${s.label}</div>
    <div class="code">${s.code}</div>
  `;
  btn.onclick = () => {
    state.shape = s.id;
    document.querySelectorAll(".form-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === s.id));
    document.getElementById("shapeLabel").textContent = `${s.label} (${s.code})`;
    rebuildFoil();
  };
  shapePickerEl.appendChild(btn);
});

const matPickerEl = document.getElementById("materialPicker");
MATERIALS.forEach((m) => {
  const chip = document.createElement("button");
  chip.className = "chip" + (m.id === state.material ? " active" : "");
  chip.dataset.id = m.id;
  chip.style.borderColor = m.id === state.material ? m.ui : "";
  chip.style.background = m.id === state.material ? m.ui : "";
  chip.style.color = m.id === state.material ? "#1a1a1a" : "";
  chip.innerHTML = `<span class="swatch" style="background:${m.ui}"></span>${m.label}`;
  chip.onclick = () => {
    state.material = m.id;
    document.querySelectorAll(".chip").forEach((c) => {
      const mc = MATERIALS.find((mm) => mm.id === c.dataset.id);
      const active = c.dataset.id === m.id;
      c.classList.toggle("active", active);
      c.style.borderColor = active ? mc.ui : "";
      c.style.background = active ? mc.ui : "";
      c.style.color = active ? "#1a1a1a" : "";
    });
    rebuildFoil();
  };
  matPickerEl.appendChild(chip);
});

document.getElementById("diameterSlider").addEventListener("input", (e) => {
  state.diameter = +e.target.value;
  document.getElementById("diameterValue").textContent = state.diameter;
  rebuildFoil();
});

document.getElementById("logoBtn").onclick = () => document.getElementById("logoInput").click();
document.getElementById("logoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.logoDataUrl = reader.result;
    const prev = document.getElementById("logoPreview");
    prev.style.display = "block";
    prev.style.backgroundImage = `url(${state.logoDataUrl})`;
    refreshLogoTextures();
  };
  reader.readAsDataURL(file);
});

// === Sample-Logos · 1-Klick-Test für Demo (BaCo, Cosmetic-Crown, Pharma-Cross) ===
const SAMPLE_LOGOS = [
  {
    name: "BaCo",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'><text x='100' y='72' text-anchor='middle' font-family='Georgia, serif' font-size='62' font-weight='700' fill='black' letter-spacing='-2'>BaCo</text></svg>`,
  },
  {
    name: "Krone",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20 70 L25 40 L40 60 L50 30 L60 60 L75 40 L80 70 Z' fill='black' stroke='black' stroke-width='2' stroke-linejoin='round'/><circle cx='25' cy='40' r='4' fill='black'/><circle cx='50' cy='30' r='4' fill='black'/><circle cx='75' cy='40' r='4' fill='black'/><rect x='18' y='73' width='64' height='6' fill='black'/></svg>`,
  },
  {
    name: "Pharma",
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='40' y='15' width='20' height='70' fill='black' rx='2'/><rect x='15' y='40' width='70' height='20' fill='black' rx='2'/></svg>`,
  },
];

function loadSampleLogo(svgString: string) {
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  state.logoDataUrl = dataUrl;
  const prev = document.getElementById("logoPreview");
  prev.style.display = "block";
  prev.style.backgroundImage = `url(${dataUrl})`;
  refreshLogoTextures();
}

const sampleRow = document.getElementById("sampleLogosRow");
SAMPLE_LOGOS.forEach((logo) => {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.style.cssText = `
    flex: 1; min-width: 0; padding: 8px 4px; font-size: 11px;
    background: rgba(212,175,55,0.08); border-color: rgba(212,175,55,0.3);
  `;
  btn.innerHTML = `<span style="font-size:10px; opacity:0.7; margin-right:4px;">📷</span>${logo.name}`;
  btn.onclick = () => loadSampleLogo(logo.svg);
  sampleRow.appendChild(btn);
});

// === Smooth Form-Transition · Fade alte Group, fade neue rein ===
let _previousFoilGroup: any = null;
const _origRebuild = rebuildFoil;
function rebuildFoilWithFade() {
  if (foilGroup) {
    _previousFoilGroup = foilGroup;
    // Fade out previous
    let opacity = 1;
    const fadeOut = setInterval(() => {
      opacity -= 0.18;
      if (opacity <= 0) {
        clearInterval(fadeOut);
        if (_previousFoilGroup) {
          scene.remove(_previousFoilGroup);
          _previousFoilGroup.traverse((c: any) => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) {
              if (Array.isArray(c.material)) c.material.forEach((m: any) => m.dispose());
              else c.material.dispose();
            }
          });
          _previousFoilGroup = null;
        }
      }
      if (_previousFoilGroup) {
        _previousFoilGroup.traverse((c: any) => {
          if (c.material) {
            c.material.transparent = true;
            c.material.opacity = Math.max(0, opacity);
          }
        });
      }
    }, 16);
  }
  foilGroup = null;  // force fresh build in original logic
  _origRebuild();
  // Fade in new
  if (foilGroup) {
    let inOpacity = 0;
    foilGroup.traverse((c: any) => {
      if (c.material) {
        c.material.transparent = true;
        c.material.opacity = 0;
      }
    });
    const fadeIn = setInterval(() => {
      inOpacity += 0.18;
      if (inOpacity >= 1) {
        clearInterval(fadeIn);
        inOpacity = 1;
        foilGroup.traverse((c: any) => {
          if (c.material) c.material.transparent = false;
        });
      }
      foilGroup.traverse((c: any) => {
        if (c.material) c.material.opacity = Math.min(1, inOpacity);
      });
    }, 16);
  }
}
// Replace global rebuildFoil
(window as any).rebuildFoil = rebuildFoilWithFade;

const switchEl = document.getElementById("embossSwitch");
const toggleRowEl = document.getElementById("embossToggle");
function setEmboss(v) {
  state.embossingMode = v;
  switchEl.classList.toggle("on", v);
  document.getElementById("embossDescr").textContent = v ? "An = Logo als Relief" : "Aus = Logo als Druckbild";
  document.getElementById("embossStrengthGroup").style.display = v ? "" : "none";
  refreshLogoTextures();
}
toggleRowEl.onclick = (e) => {
  if (e.target.closest("input, button")) return;
  setEmboss(!state.embossingMode);
};

document.getElementById("embossStrengthSlider").addEventListener("input", (e) => {
  state.embossStrength = +e.target.value;
  document.getElementById("embossStrengthValue").textContent = state.embossStrength.toFixed(1);
  if (state.embossingMode) refreshLogoTextures();
});

document.getElementById("resetBtn").onclick = () => {
  state.shape = "ronde";
  state.diameter = 95;
  state.material = "alu_g";
  state.logoDataUrl = null;
  state.embossingMode = false;
  state.embossStrength = 4;
  document.getElementById("logoPreview").style.display = "none";
  document.getElementById("logoInput").value = "";
  document.getElementById("diameterSlider").value = 95;
  document.getElementById("diameterValue").textContent = "95";
  document.getElementById("embossStrengthSlider").value = 4;
  document.getElementById("embossStrengthValue").textContent = "4.0";
  switchEl.classList.remove("on");
  document.getElementById("embossDescr").textContent = "Aus = Logo als Druckbild";
  document.getElementById("embossStrengthGroup").style.display = "none";
  document.querySelectorAll(".form-btn").forEach((b) => b.classList.toggle("active", b.dataset.id === "ronde"));
  document.querySelectorAll(".chip").forEach((c) => {
    const mc = MATERIALS.find((mm) => mm.id === c.dataset.id);
    const active = c.dataset.id === "alu_g";
    c.classList.toggle("active", active);
    c.style.borderColor = active ? mc.ui : "";
    c.style.background = active ? mc.ui : "";
    c.style.color = active ? "#1a1a1a" : "";
  });
  document.getElementById("shapeLabel").textContent = "Ronde (R)";
  logoDiffuseTexture = null;
  logoNormalMap = null;
  rebuildFoil();
};

// ============================================================
//  POST-PROCESSING · subtiler Bloom für Premium-Glanz
// ============================================================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.35,  // strength · subtil, nicht überstrahlend
  0.4,   // radius
  0.85   // threshold · nur sehr helle Flächen (Heißfolien-Reflexionen)
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// ============================================================
//  RESIZE + ANIMATION LOOP
// ============================================================
function resize() {
  const wrap = document.querySelector(".canvas-wrap");
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  composer.render();
}

// ============================================================
//  STRUKTURPRÄGUNG-PICKER · UI dynamisch
// ============================================================
const sampleRow_ref = document.getElementById("sampleLogosRow");
if (sampleRow_ref && !document.getElementById("praegungRow")) {
  const praegungSection = document.createElement("div");
  praegungSection.className = "group";
  praegungSection.innerHTML = `
    <div class="group-title">
      <span>Strukturprägung</span>
      <span class="value" id="praegungLabel">Glatt</span>
    </div>
    <div class="form-grid" id="praegungRow" style="grid-template-columns: repeat(3, 1fr);"></div>
  `;
  // Insert vor dem "logoBtn"-Group (nach Material-Picker)
  const logoBtn = document.getElementById("logoBtn");
  if (logoBtn && logoBtn.parentElement && logoBtn.parentElement.parentElement) {
    logoBtn.parentElement.parentElement.parentElement.insertBefore(
      praegungSection,
      logoBtn.parentElement.parentElement
    );
  }

  const praegungRowEl = document.getElementById("praegungRow");
  PRAEGUNGEN.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "form-btn" + (p.id === state.praegung ? " active" : "");
    btn.dataset.id = p.id;
    btn.innerHTML = `<div>${p.label}</div><div class="code">${p.ui}</div>`;
    btn.onclick = () => {
      state.praegung = p.id;
      document.querySelectorAll("#praegungRow .form-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.id === p.id);
      });
      document.getElementById("praegungLabel").textContent = p.label;
      rebuildFoil();
    };
    praegungRowEl.appendChild(btn);
  });
}

rebuildFoil();
animate();
