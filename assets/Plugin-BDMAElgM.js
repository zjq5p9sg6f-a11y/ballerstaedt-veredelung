import { j as jsxRuntimeExports } from './jsx-runtime-dGY4lsZt.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__-D7cIg9rU.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__-UvYDSipU.js';
import './_commonjsHelpers-B85MJLTf.js';

// dev uses dynamic import to separate chunks
    
    const {loadShare: loadShare$1} = index_cjs;
    const {initPromise: initPromise$1} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res$1 = initPromise$1.then(_ => loadShare$1("@mui/material", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^7.1.1"
    }}}));
    const exportModule$1 = await res$1.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__ = exportModule$1;

const LogoUploader = () => (props) => {
  const dataUrl = props.selection?.data?.dataUrl;
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      props.onChange(props.value.id, {
        dataUrl: reader.result,
        fileName: file.name
      });
    };
    reader.readAsDataURL(file);
  };
  const clear = () => {
    props.onChange(props.value.id, { dataUrl: null, fileName: null });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Stack, { direction: "row", gap: 2, alignItems: "center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Button, { variant: "outlined", component: "label", size: "small", children: [
      "Logo wählen",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "file",
          accept: "image/png,image/jpeg,image/svg+xml",
          hidden: true,
          onChange: handleFile
        }
      )
    ] }),
    dataUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Box,
        {
          sx: {
            width: 56,
            height: 56,
            border: "1px solid #ddd",
            borderRadius: 1,
            backgroundImage: `url(${dataUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "#fafafa"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Stack, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Typography, { variant: "caption", sx: { maxWidth: 180 }, noWrap: true, children: props.selection?.data?.fileName ?? "logo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Button, { size: "small", onClick: clear, children: "Entfernen" })
      ] })
    ] }),
    !dataUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__.Typography, { variant: "caption", color: "text.secondary", children: "PNG / JPG / SVG · transparenter Hintergrund empfohlen" })
  ] });
};

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("@react-three/drei", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^10.1.2"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__ = exportModule;

const MM = 0.01;
function laschePath(shape, edgeR, side = "right") {
  const w = 14 * MM, h = 18 * MM;
  const sx = side === "right" ? edgeR : -edgeR;
  const dir = side === "right" ? 1 : -1;
  shape.moveTo(sx, -0.14 / 2);
  shape.lineTo(sx + dir * h * 0.6, -0.14 / 2 * 0.85);
  shape.quadraticCurveTo(sx + dir * h, 0, sx + dir * h * 0.6, w / 2 * 0.85);
  shape.lineTo(sx, w / 2);
}
function rondeGeo(diameterMm, withLasche) {
  const r = diameterMm / 2 * MM;
  const shape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
  if (withLasche) {
    const angleStart = Math.asin(14 * MM / 2 / r) || 0.08;
    shape.absarc(0, 0, r, angleStart, 2 * Math.PI - angleStart, false);
    laschePath(shape, r * Math.cos(angleStart), "right");
    shape.lineTo(r * Math.cos(angleStart), -r * Math.sin(angleStart));
  } else {
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  }
  return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(shape, 96);
}
function ovalGeo(diameterMm, withLasche) {
  const w = diameterMm / 2 * MM;
  const h = diameterMm / 2 * MM * 0.7;
  const shape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
  if (withLasche) {
    const angleStart = 0.18;
    shape.absellipse(0, 0, w, h, angleStart, 2 * Math.PI - angleStart, false, 0);
    laschePath(shape, w * Math.cos(angleStart), "right");
    shape.lineTo(w * Math.cos(angleStart), -h * Math.sin(angleStart));
  } else {
    shape.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
  }
  return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(shape, 96);
}
function buildFlatFoil(geometry, material) {
  const mesh = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  group.add(mesh);
  return group;
}
function buildKappe(diameterMm, material, withLasche) {
  const r = diameterMm / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const sphereGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SphereGeometry(r, 96, 32, 0, Math.PI * 2, 0, Math.PI / 3.5);
  const sphere = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(sphereGeo, material);
  sphere.scale.y = 0.35;
  group.add(sphere);
  const baseGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96);
  const base = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(baseGeo, material);
  base.rotation.x = -Math.PI / 2;
  group.add(base);
  if (withLasche) {
    const laschenShape = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
    laschePath(laschenShape, r, "right");
    laschenShape.lineTo(r, -7 * MM);
    const laschenGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(laschenShape, 16);
    const lasche = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(laschenGeo, material);
    lasche.rotation.x = -Math.PI / 2;
    group.add(lasche);
  }
  return group;
}
function buildInduktion(diameterMm, material) {
  const r = diameterMm / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const disc = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96), material);
  disc.rotation.x = -Math.PI / 2;
  group.add(disc);
  const innerR = r * 0.7;
  const ringGeo = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.RingGeometry(innerR * 0.92, innerR, 96);
  const ringMat = material.clone ? material.clone() : new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({});
  if (ringMat.color && ringMat.color.set) ringMat.color.set(9079434);
  if (typeof ringMat.metalness === "number") ringMat.metalness = Math.min(material.metalness + 0.05, 1);
  if (typeof ringMat.roughness === "number") ringMat.roughness = Math.max(material.roughness - 0.1, 0.05);
  const ring = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 1e-3;
  group.add(ring);
  return group;
}
function buildBacoBond(diameterMm, material) {
  const r = diameterMm / 2 * MM;
  const group = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
  const top = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 96), material);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 8e-3;
  group.add(top);
  const linerMat = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
    color: 15788248,
    metalness: 0,
    roughness: 0.85,
    side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide
  });
  const liner = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r * 0.97, 96), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 1e-3;
  group.add(liner);
  return group;
}
function buildSealFoil(opts) {
  const { shape, diameterMm, material } = opts;
  switch (shape) {
    case "ronde":
      return buildFlatFoil(rondeGeo(diameterMm, false), material);
    case "ronde-lasche":
      return buildFlatFoil(rondeGeo(diameterMm, true), material);
    case "kappe":
      return buildKappe(diameterMm, material, false);
    case "kappe-lasche":
      return buildKappe(diameterMm, material, true);
    case "verformt-lasche":
      return buildFlatFoil(ovalGeo(diameterMm, true), material);
    case "verformte-ronde":
      return buildFlatFoil(ovalGeo(diameterMm, false), material);
    case "induktionssiegel":
      return buildInduktion(diameterMm, material);
    case "baco-bond":
      return buildBacoBond(diameterMm, material);
    default:
      return buildFlatFoil(rondeGeo(diameterMm, false), material);
  }
}
const SHAPE_INDEX_MAP = [
  "ronde",
  "ronde-lasche",
  "kappe",
  "kappe-lasche",
  "verformt-lasche",
  "verformte-ronde",
  "induktionssiegel",
  "baco-bond"
];
function normalizeShape(raw) {
  if (raw === null || raw === undefined) return "ronde";
  if (typeof raw === "number") {
    if (raw >= 0 && raw < SHAPE_INDEX_MAP.length) return SHAPE_INDEX_MAP[raw];
    if (raw >= 1 && raw <= SHAPE_INDEX_MAP.length) return SHAPE_INDEX_MAP[raw - 1];
    return "ronde";
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.value !== undefined) return normalizeShape(raw.value);
    if (raw.label !== undefined) return normalizeShape(raw.label);
    if (raw.name !== undefined) return normalizeShape(raw.name);
    if (raw.id !== undefined) return normalizeShape(raw.id);
    if (raw.code !== undefined) return normalizeShape(raw.code);
    if (raw.text !== undefined) return normalizeShape(raw.text);
    return "ronde";
  }
  if (Array.isArray(raw) && raw.length > 0) {
    return normalizeShape(raw[0]);
  }
  const s = String(raw).toLowerCase().trim();
  const idMatch = [
    "ronde-lasche",
    "kappe-lasche",
    "verformt-lasche",
    "verformte-ronde",
    "induktionssiegel",
    "baco-bond",
    "kappe",
    "ronde"
  ];
  for (const id of idMatch) {
    if (s === id) return id;
  }
  if (s.includes("psl") || s.includes("baco bond") || s.includes("baco-bond") || s.includes("r-r")) return "baco-bond";
  if (s.includes("induktion") || s === "ir" || s.startsWith("ir ") || s.endsWith(" ir")) return "induktionssiegel";
  if (s.includes("verformt") && s.includes("lasche")) return "verformt-lasche";
  if (s.includes("verformt") || s.includes("oval")) return "verformte-ronde";
  if (s.includes("kappe") && s.includes("lasche")) return "kappe-lasche";
  if (s.includes("kappe") || s === "k") return "kappe";
  if ((s.includes("ronde") || s.includes("flachplatine") || s === "ar") && s.includes("lasche")) return "ronde-lasche";
  return "ronde";
}
const MATERIAL_PRESETS = [
  { id: "alu_g", label: "Alu glänzend", color: 14211288, metalness: 0.92, roughness: 0.18 },
  { id: "alu_m", label: "Alu matt", color: 12434877, metalness: 0.55, roughness: 0.6 },
  { id: "kunst", label: "Kunststoff", color: 16185076, metalness: 0, roughness: 0.65 },
  { id: "gold", label: "Gold-Lack", color: 13938487, metalness: 1, roughness: 0.15 },
  { id: "silber", label: "Silber-Lack", color: 13620957, metalness: 1, roughness: 0.1 },
  { id: "kupfer", label: "Kupfer-Lack", color: 12088115, metalness: 1, roughness: 0.18 }
];
function normalizeMaterial(raw) {
  if (raw === null || raw === undefined) return MATERIAL_PRESETS[0];
  if (typeof raw === "number") {
    if (raw >= 0 && raw < MATERIAL_PRESETS.length) return MATERIAL_PRESETS[raw];
    if (raw >= 1 && raw <= MATERIAL_PRESETS.length) return MATERIAL_PRESETS[raw - 1];
    return MATERIAL_PRESETS[0];
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.value !== undefined) return normalizeMaterial(raw.value);
    if (raw.label !== undefined) return normalizeMaterial(raw.label);
    if (raw.name !== undefined) return normalizeMaterial(raw.name);
    if (raw.id !== undefined) return normalizeMaterial(raw.id);
    return MATERIAL_PRESETS[0];
  }
  if (Array.isArray(raw) && raw.length > 0) return normalizeMaterial(raw[0]);
  const s = String(raw).toLowerCase().trim();
  for (const p of MATERIAL_PRESETS) {
    if (s === p.id) return p;
  }
  if (s.includes("gold")) return MATERIAL_PRESETS[3];
  if (s.includes("silber") || s.includes("silver")) return MATERIAL_PRESETS[4];
  if (s.includes("kupfer") || s.includes("copper")) return MATERIAL_PRESETS[5];
  if (s.includes("kunst") || s.includes("plastic")) return MATERIAL_PRESETS[2];
  if (s.includes("matt")) return MATERIAL_PRESETS[1];
  return MATERIAL_PRESETS[0];
}

const SCENE_MM$1 = 0.01;
const GLB_MM = 1e-3;
const GLB_TO_SCENE = SCENE_MM$1 / GLB_MM;
const CAD_REFERENCE_DIAMETER_MM$1 = 53;
function SealFoilGLB({ url, material, diameterMm = 95 }) {
  const gltf = ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.useGLTF(url);
  const cloned = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    const c = gltf.scene.clone(true);
    c.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = material;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return c;
  }, [gltf.scene, material]);
  const scale = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    return GLB_TO_SCENE * (diameterMm / CAD_REFERENCE_DIAMETER_MM$1);
  }, [diameterMm]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("primitive", { object: cloned, scale: [scale, scale, scale] });
}
ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.useGLTF.preload("/models/kappe.glb");
ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.useGLTF.preload("/models/kappe-lasche.glb");
ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.useGLTF.preload("/models/verformt-lasche.glb");
ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.useGLTF.preload("/models/verformte-ronde.glb");

let occtPromise = null;
function loadOcct() {
  if (occtPromise) return occtPromise;
  occtPromise = new Promise((resolve, reject) => {
    if (window.occtimportjs) {
      window.occtimportjs().then(resolve).catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "/occt-import-js.js";
    script.onload = () => {
      window.occtimportjs().then(resolve).catch(reject);
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
  return occtPromise;
}
const geoCache = /* @__PURE__ */ new Map();
async function loadStepGeometry(url) {
  const cached = geoCache.get(url);
  if (cached) return cached;
  const p = (async () => {
    const occt = await loadOcct();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`fetch ${url}: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const fileBuffer = new Uint8Array(buffer);
    const result = occt.ReadStepFile(fileBuffer, {
      linearUnit: "millimeter",
      linearDeflectionType: "absolute_value",
      linearDeflection: 0.01,
      angularDeflection: 0.1
    });
    if (!result.success) throw new Error(`occt parse failed: ${url}`);
    const geometries = [];
    const bbox = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Box3();
    for (const m of result.meshes) {
      const g = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BufferGeometry();
      g.setAttribute(
        "position",
        new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Float32BufferAttribute(m.attributes.position.array, 3)
      );
      if (m.attributes.normal) {
        g.setAttribute(
          "normal",
          new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Float32BufferAttribute(m.attributes.normal.array, 3)
        );
      }
      if (m.index) {
        const idx = Uint32Array.from(m.index.array);
        g.setIndex(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.BufferAttribute(idx, 1));
      }
      if (!m.attributes.normal) g.computeVertexNormals();
      g.computeBoundingBox();
      bbox.union(g.boundingBox);
      geometries.push(g);
    }
    const size = bbox.getSize(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3());
    const cadDiameterMm = Math.max(size.x, size.y, size.z);
    return { geometries, bbox, cadDiameterMm };
  })();
  geoCache.set(url, p);
  return p;
}
let preloadStarted = false;
function preloadAll() {
  if (preloadStarted) return;
  preloadStarted = true;
  const urls = [
    "/step/kappe.stp",
    "/step/kappe-lasche.stp",
    "/step/verformt-lasche.stp",
    "/step/verformte-ronde.stp"
  ];
  for (const u of urls) {
    loadStepGeometry(u).catch(() => {
    });
  }
}
const SCENE_MM = 0.01;
const CAD_REFERENCE_DIAMETER_MM = 53;
function SealFoilSTEP({ url, material, diameterMm = 95 }) {
  const [geo, setGeo] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  const [error, setError] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(() => {
    preloadAll();
  }, []);
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(() => {
    let cancelled = false;
    setGeo(null);
    setError(null);
    loadStepGeometry(url).then((g) => {
      if (!cancelled) setGeo(g);
    }).catch((e) => {
      if (cancelled) return;
      console.error("[SealFoilSTEP]", url, e);
      setError(String(e?.message || e));
    });
    return () => {
      cancelled = true;
    };
  }, [url]);
  const group = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    if (!geo) return null;
    const inner = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
    for (const g of geo.geometries) {
      const mesh = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Mesh(g, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      inner.add(mesh);
    }
    const center = geo.bbox.getCenter(new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Vector3());
    inner.position.sub(center);
    const outer = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Group();
    outer.add(inner);
    const finalScale = diameterMm * SCENE_MM / CAD_REFERENCE_DIAMETER_MM;
    outer.scale.setScalar(finalScale);
    return outer;
  }, [geo, material, diameterMm]);
  if (error) return null;
  if (!group) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("primitive", { object: group });
}

const FORM_STEP_MAP = {
  "kappe": "/step/kappe.stp",
  "kappe-lasche": "/step/kappe-lasche.stp",
  "verformt-lasche": "/step/verformt-lasche.stp",
  "verformte-ronde": "/step/verformte-ronde.stp"
};
const FORM_GLB_MAP = {
  "kappe": "/models/kappe.glb",
  "kappe-lasche": "/models/kappe-lasche.glb",
  "verformt-lasche": "/models/verformt-lasche.glb",
  "verformte-ronde": "/models/verformte-ronde.glb"
};
function SealFoil(props) {
  const {
    shape = "ronde",
    diameterMm = 95,
    materialPreset,
    baseColor,
    metalness,
    roughness,
    diffuseTexture,
    normalMap,
    metalnessMap,
    roughnessMap
  } = props;
  const normalizedShape = normalizeShape(shape);
  const material = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    const preset = normalizeMaterial(materialPreset);
    const m = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.MeshPhysicalMaterial({
      color: baseColor !== undefined ? new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(baseColor) : new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Color(preset.color),
      metalness: metalness ?? preset.metalness,
      roughness: roughness ?? preset.roughness,
      side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide,
      envMapIntensity: 1.4
    });
    if (diffuseTexture) m.map = diffuseTexture;
    if (normalMap) m.normalMap = normalMap;
    if (metalnessMap) m.metalnessMap = metalnessMap;
    if (roughnessMap) m.roughnessMap = roughnessMap;
    return m;
  }, [
    materialPreset,
    baseColor,
    metalness,
    roughness,
    diffuseTexture,
    normalMap,
    metalnessMap,
    roughnessMap
  ]);
  const stepUrl = FORM_STEP_MAP[normalizedShape];
  const glbUrl = FORM_GLB_MAP[normalizedShape];
  console.log("[SealFoil] shape=", shape, "→ normalized=", normalizedShape, "→ stepUrl=", stepUrl, "glbUrl=", glbUrl);
  const group = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    if (stepUrl || glbUrl) return null;
    return buildSealFoil({
      shape: normalizedShape,
      diameterMm,
      material
    });
  }, [normalizedShape, diameterMm, material, stepUrl, glbUrl]);
  if (stepUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SealFoilSTEP, { url: stepUrl, material, diameterMm });
  }
  if (glbUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SealFoilGLB, { url: glbUrl, material, diameterMm });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("primitive", { object: group });
}

function imageToNormalMap(source, options = {}) {
  const strength = options.strength ?? 2;
  const sign = options.invert ? -1 : 1;
  const w = source.width;
  const h = source.height;
  const reader = document.createElement("canvas");
  reader.width = w;
  reader.height = h;
  const rctx = reader.getContext("2d");
  rctx.drawImage(source, 0, 0);
  const src = rctx.getImageData(0, 0, w, h).data;
  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = src[i * 4];
    const g = src[i * 4 + 1];
    const b = src[i * 4 + 2];
    const a = src[i * 4 + 3] / 255;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    height[i] = lum * a;
  }
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  const img = octx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const x0 = x === 0 ? 0 : x - 1;
      const x1 = x === w - 1 ? w - 1 : x + 1;
      const y0 = y === 0 ? 0 : y - 1;
      const y1 = y === h - 1 ? h - 1 : y + 1;
      const tl = height[y0 * w + x0];
      const tc = height[y0 * w + x];
      const tr = height[y0 * w + x1];
      const ml = height[y * w + x0];
      const mr = height[y * w + x1];
      const bl = height[y1 * w + x0];
      const bc = height[y1 * w + x];
      const br = height[y1 * w + x1];
      const dx = tr + 2 * mr + br - (tl + 2 * ml + bl);
      const dy = bl + 2 * bc + br - (tl + 2 * tc + tr);
      const nx = -dx * strength * sign;
      const ny = -dy * strength * sign;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const o = i * 4;
      img.data[o] = Math.round((nx / len * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round((ny / len * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round((nz / len * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  const texture = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CanvasTexture(out);
  texture.colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}
function dataUrlToImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}
async function dataUrlToNormalMap(dataUrl, options = {}) {
  const img = await dataUrlToImage(dataUrl);
  return imageToNormalMap(img, options);
}
async function dataUrlToDiffuseTexture(dataUrl) {
  const img = await dataUrlToImage(dataUrl);
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  c.getContext("2d").drawImage(img, 0, 0);
  const tex = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CanvasTexture(c);
  tex.colorSpace = ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

const screenshot = ""+new URL('Image-lYiF6YAQ.png', import.meta.url).href+"";

const extractImageUrl = (val) => {
  if (!val) return undefined;
  if (typeof val === "string" && val.length > 0) return val;
  if (typeof val === "object") {
    if (val.url) return val.url;
    if (val.dataUrl) return val.dataUrl;
    if (val.src) return val.src;
    if (Array.isArray(val) && val[0]) return extractImageUrl(val[0]);
    if (val[0]?.data) return extractImageUrl(val[0].data);
    if (val.data) return extractImageUrl(val.data);
  }
  return undefined;
};
function resolveValueFromAnyPath(props, candidates, validator) {
  for (const key of candidates) {
    const v = props?.[key];
    if (v !== undefined && v !== null && (true)) {
      return { value: v, source: `props.${key}` };
    }
  }
  if (props?.context && typeof props.context === "object") {
    for (const key of candidates) {
      const v = props.context[key];
      if (v !== undefined && v !== null && (true)) {
        return { value: v, source: `props.context.${key}` };
      }
    }
  }
  if (props?.slots && typeof props.slots === "object") {
    for (const key of candidates) {
      const v = props.slots[key];
      if (v !== undefined && v !== null && (true)) {
        return { value: v, source: `props.slots.${key}` };
      }
    }
  }
  for (const actionKey of ["materialActions", "colorActions", "printActions"]) {
    const arr = props?.[actionKey];
    if (Array.isArray(arr)) {
      for (const a of arr) {
        if (!a) continue;
        for (const key of candidates) {
          if (a.id === key || a.name === key || a.key === key) {
            const v = a.value ?? a.selected ?? a.current;
            if (v !== undefined && v !== null && (true)) {
              return { value: v, source: `${actionKey}[${key}].value` };
            }
          }
        }
      }
    }
  }
  return { value: undefined, source: "default" };
}
const SealFoilDynamic = (props) => {
  const [diffuseTexture, setDiffuseTexture] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  const [normalMap, setNormalMap] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  const shapeRes = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(
    () => resolveValueFromAnyPath(props, [
      "shape",
      "form",
      "Form",
      "Form_value",
      "FormValue",
      "FormIndex",
      "shape_id"
    ]),
    [props.shape, props.form, props.Form, props.context, props.slots, props.materialActions]
  );
  const materialRes = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(
    () => resolveValueFromAnyPath(props, [
      "materialPreset",
      "material",
      "Material",
      "MaterialIndex",
      "MaterialPreset"
    ]),
    [props.materialPreset, props.material, props.Material, props.context, props.slots, props.materialActions]
  );
  const printLogoRaw = props.printLogoUrl ?? props.logoUpload ?? props.logo ?? props.Logo_Druckbild ?? props["Logo / Druckbild"] ?? props.context?.Logo_Druckbild ?? props.context?.printLogo;
  const printLogoUrl = extractImageUrl(printLogoRaw);
  const embossingRaw = props.embossingLogoUrl ?? props.embossingLogo ?? props.praegung ?? props["Prägung"] ?? props.context?.praegung;
  const embossingLogoUrl = extractImageUrl(embossingRaw);
  const embossingMode = Boolean(props.embossingMode) || Boolean(embossingLogoUrl);
  const activeUrl = embossingMode ? embossingLogoUrl ?? printLogoUrl : printLogoUrl;
  const normalizedShape = normalizeShape(shapeRes.value);
  const normalizedMaterial = normalizeMaterial(materialRes.value);
  if (typeof window !== "undefined") {
    console.group(
      "%c[SealFoilPlugin] PROPS DEBUG",
      "background:#d4af37;color:#000;padding:2px 6px;font-weight:bold"
    );
    console.log("Resolved shape:", normalizedShape, "from:", shapeRes.source, "raw:", shapeRes.value);
    console.log("Resolved material:", normalizedMaterial.label, "from:", materialRes.source);
    console.log("printLogoUrl resolved:", printLogoUrl ? "YES" : "no");
    console.log("embossingMode:", embossingMode);
    console.log("--- raw inspection ---");
    console.log("props.context:", props.context);
    console.log("props.slots:", props.slots);
    console.log("props.materialActions:", props.materialActions);
    console.log("props.colorActions:", props.colorActions);
    console.log("props.printActions:", props.printActions);
    console.log("ALL prop keys:", Object.keys(props));
    console.log("FULL props:", props);
    console.groupEnd();
  }
  ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useEffect(() => {
    let cancelled = false;
    if (!activeUrl) {
      setDiffuseTexture(null);
      setNormalMap(null);
      return;
    }
    (async () => {
      try {
        const diff = await dataUrlToDiffuseTexture(activeUrl);
        const norm = embossingMode ? await dataUrlToNormalMap(activeUrl, { strength: props.embossStrength ?? 4 }) : null;
        if (cancelled) return;
        setDiffuseTexture(embossingMode ? null : diff);
        setNormalMap(norm);
      } catch (err) {
        console.error("[SealFoilPlugin] texture-load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUrl, embossingMode, props.embossStrength]);
  const [internalShape, setInternalShape] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  const effectiveShape = internalShape ?? normalizedShape;
  const SHAPES = [
    { id: "ronde", label: "Ronde", code: "R" },
    { id: "ronde-lasche", label: "Ronde·Lasche", code: "AR" },
    { id: "kappe", label: "Kappe", code: "K" },
    { id: "kappe-lasche", label: "Kappe·Lasche", code: "AK" },
    { id: "verformt-lasche", label: "AL · Tiefgezogen·Lasche", code: "AL" },
    { id: "verformte-ronde", label: "Tiefgezogen", code: "—" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "group",
    {
      position: props.position,
      scale: [props.width ?? 1, props.height ?? 1, props.depth ?? 1],
      userData: { modelId: props.id },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SealFoil,
          {
            shape: effectiveShape,
            diameterMm: props.diameterMm ?? 95,
            materialPreset: normalizedMaterial.id,
            baseColor: props.baseColor,
            metalness: props.metalness,
            roughness: props.roughness,
            diffuseTexture,
            normalMap
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ballerstaedt_mf_2_veredelung__loadShare___mf_0_react_mf_2_three_mf_1_drei__loadShare__.Html, { position: [0, 0.85, 0], center: true, distanceFactor: 6, occlude: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              gap: 4,
              padding: 6,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              borderRadius: 8,
              border: "1px solid rgba(212,175,55,0.4)",
              fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
              userSelect: "none"
            },
            children: SHAPES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setInternalShape(s.id);
                },
                style: {
                  background: effectiveShape === s.id ? "#d4af37" : "rgba(255,255,255,0.08)",
                  color: effectiveShape === s.id ? "#1a1a1a" : "white",
                  border: "none",
                  padding: "5px 9px",
                  borderRadius: 5,
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s"
                },
                title: `${s.label} (${s.code})`,
                children: s.label
              },
              s.id
            ))
          }
        ) })
      ]
    }
  );
};
const dynamicSealFoil = {
  type: "sealFoilPlugin",
  label: "Siegelfolie",
  disabledForAR: false,
  component: SealFoilDynamic,
  propsDialog: {
    basic: { type: "basic" },
    // Variable-Selektor-Dropdown im Admin-UI · saubere Bindung statt Formel-Editor
    shape: { type: "variable", label: "Form", allowedTypes: ["list"] },
    materialPreset: { type: "variable", label: "Material", allowedTypes: ["list"] },
    embossingMode: { type: "variable", label: "Prägung", allowedTypes: ["list", "boolean"] },
    printLogoUrl: { type: "variable", label: "Druck-Logo", allowedTypes: ["image", "upload"] },
    embossingLogoUrl: { type: "variable", label: "Prägung-Logo", allowedTypes: ["image", "upload"] },
    // Numerische Direkt-Properties (Expressions OK weil keine Variable-Bindung nötig)
    diameterMm: { type: "expression", label: "Durchmesser (mm)" },
    metalness: { type: "expression", label: "Metallizität" },
    roughness: { type: "expression", label: "Rauheit" },
    embossStrength: { type: "expression", label: "Prägetiefe" }
  },
  defaultProps: {
    // K3 verlangt numerische Formel-Ergebnisse — alle Defaults als Number.
    // Strings würden Fehler "Formel muss Zahlenwert sein" werfen.
    width: { expression: "1" },
    height: { expression: "1" },
    depth: { expression: "1" },
    shape: { expression: "0" },
    // 0 = Ronde (siehe SHAPE_INDEX_MAP)
    diameterMm: { expression: "95" },
    materialPreset: { expression: "0" },
    // 0 = Alu glänzend (siehe MATERIAL_PRESETS)
    metalness: { expression: "0.85" },
    roughness: { expression: "0.32" },
    embossingMode: { expression: "0" },
    // 0 = false / 1 = true
    embossStrength: { expression: "4" }
  },
  materials: ["body"],
  screenshot
};

const Plugin = {
  dynamicModels: [dynamicSealFoil],
  variableTemplates: [
    {
      key: "logoUpload",
      label: "Logo / Druckbild",
      type: "image",
      component: LogoUploader
    }
  ],
  layoutComponents: {}
};

export { Plugin as default };
