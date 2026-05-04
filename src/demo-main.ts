// @ts-nocheck
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
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
const state: any = {
  shape: "ronde",
  diameter: 95,
  material: "alu_g",
  praegung: "glatt",
  printLogoDataUrl: null,   // Logo als Druckbild (Diffuse-Map)
  embossLogoDataUrl: null,  // Logo als Blindprägung (Normal-Map via Sobel)
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
const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 100);
// Hero-Camera · näher dran, leicht über Augenhöhe, dramatisch
camera.position.set(0.0, 0.42, 2.15);

// ============================================================
//  STUDIO-HDR · Polyhaven · Hauptbeleuchtung kommt aus HDR
// ============================================================
const pmrem = new THREE.PMREMGenerator(renderer);
pmrem.compileEquirectangularShader();

// Sofort-Fallback während HDR lädt (prozedural)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

new RGBELoader()
  .setPath("./textures/")
  .load(
    "studio.hdr",
    (texture: any) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const envMap = pmrem.fromEquirectangular(texture).texture;
      scene.environment = envMap;
      texture.dispose();
      // eslint-disable-next-line no-console
      console.log("[HDR] Studio-Environment geladen");
    },
    undefined,
    (err: any) => {
      // eslint-disable-next-line no-console
      console.warn("[HDR] Fallback auf RoomEnvironment", err);
    }
  );

// === Beautydish-Setup · Photographer-Light für Strukturen ===
// Charakter: halbweich, definierte Highlights, hohe Detailwiedergabe in Mikrostrukturen
// (im Gegensatz zu Softbox, die Strukturen glättet)
//
// Beautydish-Sim: SpotLight mit engem Kegel + mittlerer Penumbra + hoher Decay
// Position: leicht von oben-vorn, 30° Kameraachse-Versatz (Standard-Studio-Setup)

const beautydish = new THREE.SpotLight(
  0xfff8ee,          // sehr leicht warm (5500K-Tageslicht-Look)
  1.4,               // intensity · realistisch, nicht überstrahlend
  5,                 // distance
  Math.PI / 7.5,     // cone angle ~24°
  0.55,              // penumbra
  1.6                // decay
);
beautydish.position.set(0.4, 2.6, 1.2);
beautydish.target.position.set(0, 0, 0);
beautydish.castShadow = true;
beautydish.shadow.mapSize.set(2048, 2048);
beautydish.shadow.bias = -0.0002;
beautydish.shadow.radius = 4;
beautydish.shadow.camera.near = 0.1;
beautydish.shadow.camera.far = 8;
scene.add(beautydish);
scene.add(beautydish.target);

// Subtle Fill-Reflektor · gegenüber positioniert, dunkler — verhindert too-stark Schatten
const fillReflector = new THREE.DirectionalLight(0xfff8ee, 0.25);
fillReflector.position.set(-1.8, 0.6, 0.8);
scene.add(fillReflector);

// Renderer · Shadow-Setup
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.toneMappingExposure = 0.78;  // realistic camera-look · keine Überbelichtung

// ============================================================
//  PURE BLACK BACKDROP · keine Effekte, kein Boden
// ============================================================
scene.background = new THREE.Color(0x000000);

// (deaktiviert) Star-Field-Generator bleibt im Code für ggf. spätere Rückkehr
function _disabled_buildStarField_unused() {
  return null;
}
const stars: any = null;
const galacticHaze: any = null;
// Original-Star-Field-Implementierung deaktiviert · siehe Git-History falls Reaktivierung gewünscht
function _ignore_legacy_starfield() {
// Konzentration entlang Galactic-Plane (y ~ 0) · Power-Law-Distribution für Größen
// Stars sind weiß / leicht bläulich (heiße Sterne) / leicht gelblich (kühle Sterne)
function buildStarField() {
  const N = 9000;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const siz = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    // 60% Sterne in Milky-Way-Band (dichter), 40% gleichverteilt am Himmel
    const inBand = Math.random() < 0.6;
    let theta = Math.random() * Math.PI * 2;
    let phi: number;
    if (inBand) {
      // Konzentriert nahe equator (galactic plane) · Gauss um phi=π/2
      const u = Math.random() + Math.random() + Math.random() - 1.5;  // approx normal
      phi = Math.PI / 2 + u * 0.35;  // ±20° um equator
    } else {
      phi = Math.acos(2 * Math.random() - 1);
    }
    const r = 70 + Math.random() * 30;
    pos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3 + 1] = r * Math.cos(phi);
    pos[i*3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // Star-Color: realistic stellar classes (Wien's law)
    // 70% sun-like (white-yellow), 20% blue-white (heiß), 10% red-orange (kühl)
    const t = Math.random();
    if (t < 0.7) {
      col[i*3]   = 1.0;
      col[i*3+1] = 0.97 + Math.random() * 0.03;
      col[i*3+2] = 0.92 + Math.random() * 0.06;
    } else if (t < 0.9) {
      col[i*3]   = 0.78 + Math.random() * 0.1;
      col[i*3+1] = 0.85 + Math.random() * 0.1;
      col[i*3+2] = 1.0;
    } else {
      col[i*3]   = 1.0;
      col[i*3+1] = 0.7 + Math.random() * 0.15;
      col[i*3+2] = 0.5 + Math.random() * 0.15;
    }

    // Power-law: viele kleine, wenige große (HR-Diagramm-realistisch)
    siz[i] = 0.5 + Math.pow(Math.random(), 5) * 5.0;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  g.setAttribute("size",     new THREE.BufferAttribute(siz, 1));

  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPxRatio: { value: renderer.getPixelRatio() } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uPxRatio;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 0.88 + 0.12 * sin(uTime * 1.5 + size * 19.0);
        // CLAMPED · keine Mega-Rectangles bei nahen Stars
        float ps = size * twinkle * (180.0 / max(-mv.z, 1.0));
        gl_PointSize = clamp(ps, 0.5, 12.0) * uPxRatio;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        // Realistische Stern-Helligkeitskurve (Gauss)
        float a = exp(-d * d * 18.0);
        gl_FragColor = vec4(vColor * (0.4 + a * 1.4), a);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(g, m);
}
const stars = buildStarField();
scene.add(stars);

// === Galactic-Dust-Band · subtle haze entlang Milky-Way-Plane ===
// Sehr dezenter weißlich-grauer Glow als Andeutung des galactic core
function buildGalacticHaze() {
  const geo = new THREE.SphereGeometry(55, 64, 32);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPos;
      // simple noise
      float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 54.227))) * 43758.5453); }
      float noise(vec3 p) {
        vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(
          mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
          f.z
        );
      }
      float fbm(vec3 p) {
        float s = 0.0; float a = 0.5;
        for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.0; a *= 0.5; }
        return s;
      }
      void main() {
        vec3 dir = normalize(vWorldPos);
        // Konzentriert entlang galactic plane (y ~ 0)
        float bandStrength = exp(-dir.y * dir.y * 25.0);
        float n = fbm(dir * 6.0);
        float density = bandStrength * smoothstep(0.35, 0.85, n);
        // Realistische Milky-Way-Farben: warm-weiß mit leicht bläulichem Halo
        vec3 col = mix(vec3(0.18, 0.20, 0.28), vec3(0.85, 0.78, 0.62), density * 0.5);
        col *= density * 0.45;  // dezent, nicht überstrahlend
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}
// noop · galacticHaze deaktiviert
}  // close _ignore_legacy_starfield

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minPolarAngle = 0.18;
controls.maxPolarAngle = Math.PI / 2.05;
controls.enablePan = false;
controls.minDistance = 1.3;
controls.maxDistance = 4;
controls.target.set(0, 0.02, 0);
// Auto-Rotate · langsam, hypnotisch — pausiert bei User-Input (auto-resume nach idle)
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// User-Interaction pausiert Auto-Rotate · während Drag: UI fade-out (freie Sicht auf Folie)
let autoRotateResumeTimer: any = null;
controls.addEventListener("start", () => {
  controls.autoRotate = false;
  document.body.classList.add("dragging");
  if (autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
});
controls.addEventListener("end", () => {
  document.body.classList.remove("dragging");
  if (autoRotateResumeTimer) clearTimeout(autoRotateResumeTimer);
  autoRotateResumeTimer = setTimeout(() => { controls.autoRotate = true; }, 4500);
});

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
    envMapIntensity: 0.85,                          // realistic, nicht überreflektiert
    clearcoat: isLack ? 0.25 : (isAlu ? 0.05 : 0.1),  // deutlich weniger Klarschicht
    clearcoatRoughness: isLack ? 0.18 : 0.35,
    sheen: matConfig.id === "kunst" ? 0.2 : 0,
    sheenColor: new THREE.Color(0xffffff),
    sheenRoughness: 0.6,
    anisotropy: isAlu ? 0.35 : 0,
    anisotropyRotation: Math.PI / 4,
    iridescence: 0,                                 // kein Regenbogen-Effekt
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
  const hasPrintLogo = !!state.printLogoDataUrl && !!logoDiffuseTexture;

  // Hot-Foil-Spot-Modus: Wenn metallisches Material + PRINT-Logo → Folie wird Alu,
  // Print-Logo wird metallisch als Overlay. Embossing bleibt unabhängig auf der Folie.
  let mainMaterial;
  if (isHotFoil && hasPrintLogo) {
    const aluBase = MATERIALS.find((m) => m.id === "alu_g");
    const tempLogoDiff = logoDiffuseTexture;
    logoDiffuseTexture = null;  // Print-Logo nicht als Diffuse, sondern als Hot-Foil-Overlay
    mainMaterial = makeMaterial(aluBase);
    logoDiffuseTexture = tempLogoDiff;
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

  // Hot-Foil-Overlay: Print-Logo wird metallisch in der gewählten Farbe
  if (isHotFoil && hasPrintLogo) {
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
  const praegung = PRAEGUNGEN.find((p) => p.id === state.praegung);
  const isHotFoil = ["gold", "silber", "kupfer"].includes(state.material);
  const hasPrint = !!state.printLogoDataUrl;
  const hasEmboss = !!state.embossLogoDataUrl;

  const veredelParts: string[] = [];
  if (hasPrint) {
    veredelParts.push(isHotFoil ? `Logo ${mat.label}` : "Druck");
  }
  if (hasEmboss) veredelParts.push("Logo-Prägung");
  if (praegung && praegung.id !== "glatt") veredelParts.push(praegung.label);
  const veredel = veredelParts.length ? " · " + veredelParts.join(" · ") : "";

  const matLabel = isHotFoil && hasPrint ? "Alu glänzend" : mat.label;
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

async function refreshPrintLogo() {
  if (!state.printLogoDataUrl) {
    logoDiffuseTexture = null;
    rebuildFoil();
    return;
  }
  const img = await loadImage(state.printLogoDataUrl);
  const diffCanvas = document.createElement("canvas");
  diffCanvas.width = img.width; diffCanvas.height = img.height;
  diffCanvas.getContext("2d").drawImage(img, 0, 0);
  logoDiffuseTexture = new THREE.CanvasTexture(diffCanvas);
  logoDiffuseTexture.colorSpace = THREE.SRGBColorSpace;
  logoDiffuseTexture.needsUpdate = true;
  rebuildFoil();
}

async function refreshEmbossLogo() {
  if (!state.embossLogoDataUrl) {
    logoNormalMap = null;
    rebuildFoil();
    return;
  }
  const img = await loadImage(state.embossLogoDataUrl);
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

// === Sample-Logos (für beide Slots verfügbar) ===
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

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function setupLogoSlot(opts: {
  btnId: string;
  inputId: string;
  previewId: string;
  sampleRowId: string;
  stateKey: "printLogoDataUrl" | "embossLogoDataUrl";
  refresh: () => void;
}) {
  const btn = document.getElementById(opts.btnId)!;
  const input = document.getElementById(opts.inputId) as HTMLInputElement;
  const preview = document.getElementById(opts.previewId)!;
  const sampleRow = document.getElementById(opts.sampleRowId)!;

  function setDataUrl(url: string | null) {
    state[opts.stateKey] = url;
    if (url) {
      preview.style.display = "block";
      preview.style.backgroundImage = `url(${url})`;
    } else {
      preview.style.display = "none";
      preview.style.backgroundImage = "";
    }
    opts.refresh();
  }

  btn.onclick = () => input.click();
  input.addEventListener("change", (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  });

  // Sample-Logos
  SAMPLE_LOGOS.forEach((logo) => {
    const sBtn = document.createElement("button");
    sBtn.className = "btn";
    sBtn.style.cssText = `
      flex: 1; min-width: 0; padding: 8px 4px; font-size: 12px;
      background: rgba(230,0,126,0.06); border-color: rgba(230,0,126,0.25);
    `;
    sBtn.innerHTML = logo.name;
    sBtn.onclick = () => setDataUrl(svgToDataUrl(logo.svg));
    sampleRow.appendChild(sBtn);
  });

  return { setDataUrl };
}

const printLogoSlot = setupLogoSlot({
  btnId: "printLogoBtn",
  inputId: "printLogoInput",
  previewId: "printLogoPreview",
  sampleRowId: "printSampleLogosRow",
  stateKey: "printLogoDataUrl",
  refresh: refreshPrintLogo,
});

const embossLogoSlot = setupLogoSlot({
  btnId: "embossLogoBtn",
  inputId: "embossLogoInput",
  previewId: "embossLogoPreview",
  sampleRowId: "embossSampleLogosRow",
  stateKey: "embossLogoDataUrl",
  refresh: refreshEmbossLogo,
});

// embossStrengthGroup nur sichtbar wenn Emboss-Logo gesetzt
function updateEmbossStrengthVisibility() {
  document.getElementById("embossStrengthGroup")!.style.display =
    state.embossLogoDataUrl ? "" : "none";
}
const _origRefreshEmboss = refreshEmbossLogo;
(globalThis as any).refreshEmbossLogo = async () => {
  await _origRefreshEmboss();
  updateEmbossStrengthVisibility();
};

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

document.getElementById("embossStrengthSlider")!.addEventListener("input", (e: any) => {
  state.embossStrength = +e.target.value;
  document.getElementById("embossStrengthValue")!.textContent = state.embossStrength.toFixed(1);
  if (state.embossLogoDataUrl) refreshEmbossLogo();
});

document.getElementById("resetBtn")!.onclick = () => {
  state.shape = "ronde";
  state.diameter = 95;
  state.material = "alu_g";
  state.praegung = "glatt";
  state.printLogoDataUrl = null;
  state.embossLogoDataUrl = null;
  state.embossStrength = 4;

  // Logo-Previews zurücksetzen
  ["printLogoPreview", "embossLogoPreview"].forEach((id) => {
    const el = document.getElementById(id)!;
    el.style.display = "none";
    el.style.backgroundImage = "";
  });
  ["printLogoInput", "embossLogoInput"].forEach((id) => {
    (document.getElementById(id) as HTMLInputElement).value = "";
  });

  (document.getElementById("diameterSlider") as HTMLInputElement).value = "95";
  document.getElementById("diameterValue")!.textContent = "95";
  (document.getElementById("embossStrengthSlider") as HTMLInputElement).value = "4";
  document.getElementById("embossStrengthValue")!.textContent = "4.0";
  document.getElementById("embossStrengthGroup")!.style.display = "none";

  document.querySelectorAll(".form-btn").forEach((b: any) =>
    b.classList.toggle("active", b.dataset.id === "ronde")
  );
  document.querySelectorAll("#materialPicker .chip").forEach((c: any) => {
    const mc = MATERIALS.find((mm) => mm.id === c.dataset.id);
    const active = c.dataset.id === "alu_g";
    c.classList.toggle("active", active);
    c.style.borderColor = active ? mc.ui : "";
    c.style.background = active ? mc.ui : "";
    c.style.color = active ? "#1a1a1a" : "";
  });
  document.querySelectorAll("#praegungRow .chip").forEach((c: any) => {
    const active = c.dataset.id === "glatt";
    c.classList.toggle("active", active);
    c.style.background = active ? "var(--magenta)" : "";
    c.style.borderColor = active ? "var(--magenta)" : "";
    c.style.color = active ? "#fff" : "";
  });
  logoDiffuseTexture = null;
  logoNormalMap = null;
  rebuildFoil();
};

// ============================================================
//  POST-PROCESSING · CGI-Studio-Pipeline
//  RenderPass → Bloom → Vignette+ColorGrade → SMAA → Output
// ============================================================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Bloom KOMPLETT AUS — echte Studio-Fotos haben kein Halo-Glow um Highlights.
// Metallische Folien-Reflexionen sind scharf-definiert, nicht weich blooming.
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.0,   // strength = 0 → effektiv aus
  0.0,
  1.0    // threshold so hoch dass nichts blooming
);
bloomPass.enabled = false;  // belt + braces
composer.addPass(bloomPass);

// Cinematic-Shader · NUR noch ganz dezente Vignette (~Foto-Komposition), kein Filter
const cinematicShader = {
  uniforms: {
    tDiffuse:  { value: null },
    uTime:     { value: 0 },
    uVigStr:   { value: 0.18 },                                  // sehr leicht
    uVigSize:  { value: 0.75 },                                  // außen
    uGrain:    { value: 0.0 },                                   // KEIN Grain
    uTint:     { value: new THREE.Vector3(1.0, 1.0, 1.0) },      // 100% neutral
    uContrast: { value: 1.0 },                                   // unverändert
    uSatur:    { value: 1.0 },                                   // unverändert
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVigStr;
    uniform float uVigSize;
    uniform float uGrain;
    uniform vec3  uTint;
    uniform float uContrast;
    uniform float uSatur;
    varying vec2 vUv;

    float rand(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 col = texture2D(tDiffuse, vUv).rgb;

      // Color-Grading · warm tint + contrast + saturation
      col *= uTint;
      col = (col - 0.5) * uContrast + 0.5;
      float gray = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(gray), col, uSatur);

      // Vignette · radial darkening
      vec2 q = vUv - 0.5;
      float vig = smoothstep(uVigSize, uVigSize - 0.4, length(q));
      col *= mix(1.0 - uVigStr * 0.5, 1.0, vig);

      // Subtle film grain (animated)
      float n = rand(vUv + vec2(uTime * 0.07));
      col += (n - 0.5) * uGrain;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
const cinematicPass = new ShaderPass(cinematicShader);
composer.addPass(cinematicPass);

// Anti-Aliasing · SMAA für glatte Kanten
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);

composer.addPass(new OutputPass());

// ============================================================
//  RESIZE + ANIMATION LOOP
// ============================================================
function resize() {
  const stage = document.getElementById("stage") || document.body;
  const w = stage.clientWidth || window.innerWidth;
  const h = stage.clientHeight || window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  controls.update();
  cinematicPass.uniforms.uTime.value = t;
  composer.render();
}

// ============================================================
//  STRUKTURPRÄGUNG-PICKER · UI dynamisch in .drawer-body einfügen
// ============================================================
(function setupPraegungPicker() {
  const drawerBody = document.querySelector(".drawer-body") as HTMLElement | null;
  if (!drawerBody || document.getElementById("praegungRow")) return;

  const printLogoBtn = document.getElementById("printLogoBtn");
  const logoGroup = printLogoBtn ? printLogoBtn.closest(".group") : null;

  const praegungSection = document.createElement("div");
  praegungSection.className = "group";
  praegungSection.innerHTML = `
    <div class="group-title">
      <span>Strukturprägung</span>
    </div>
    <div class="chip-row" id="praegungRow"></div>
  `;

  // Wichtig: einfügen in .drawer-body (gleicher Padding-Container wie andere Sections)
  if (logoGroup && logoGroup.parentElement === drawerBody) {
    drawerBody.insertBefore(praegungSection, logoGroup);
  } else {
    drawerBody.appendChild(praegungSection);
  }

  const praegungRowEl = document.getElementById("praegungRow");
  PRAEGUNGEN.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (p.id === state.praegung ? " active" : "");
    btn.dataset.id = p.id;
    btn.textContent = p.label;
    if (p.id === state.praegung) {
      btn.style.background = "var(--magenta)";
      btn.style.borderColor = "var(--magenta)";
      btn.style.color = "#fff";
    }
    btn.onclick = () => {
      state.praegung = p.id;
      document.querySelectorAll("#praegungRow .chip").forEach((b) => {
        const el = b as HTMLElement;
        const active = el.dataset.id === p.id;
        el.classList.toggle("active", active);
        el.style.background = active ? "var(--magenta)" : "";
        el.style.borderColor = active ? "var(--magenta)" : "";
        el.style.color = active ? "#fff" : "";
      });
      rebuildFoil();
    };
    praegungRowEl.appendChild(btn);
  });
})();

rebuildFoil();
animate();
