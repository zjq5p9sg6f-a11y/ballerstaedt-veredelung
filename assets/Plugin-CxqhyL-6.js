import { j as jsxRuntimeExports } from './jsx-runtime-dGY4lsZt.js';
import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__-D7cIg9rU.js';
import { b as ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ } from './ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__-BZ_dI_FZ.js';
import './_commonjsHelpers-B85MJLTf.js';

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("@mui/material", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^7.1.1"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__ = exportModule;

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
function normalizeShape(raw) {
  if (!raw) return "ronde";
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
  if (s.includes("psl") || s.includes("baco bond") || s.includes("baco-bond")) return "baco-bond";
  if (s.includes("ir") || s.includes("induktion")) return "induktionssiegel";
  if (s.includes("verformt") && s.includes("lasche")) return "verformt-lasche";
  if (s.includes("verformt") || s.includes("oval")) return "verformte-ronde";
  if (s.includes("kappe") && s.includes("lasche")) return "kappe-lasche";
  if (s.includes("kappe")) return "kappe";
  if ((s.includes("ronde") || s.includes("flachplatine")) && s.includes("lasche")) return "ronde-lasche";
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
  if (!raw) return MATERIAL_PRESETS[0];
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
  const group = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    return buildSealFoil({
      shape: normalizedShape,
      diameterMm,
      material
    });
  }, [normalizedShape, diameterMm, material]);
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
  if (typeof val === "string") return val;
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
const SealFoilDynamic = (props) => {
  const [diffuseTexture, setDiffuseTexture] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  const [normalMap, setNormalMap] = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useState(null);
  if (typeof window !== "undefined") {
    console.log("[SealFoilPlugin] received props", props);
  }
  const printLogoUrl = extractImageUrl(
    props.printLogoUrl ?? props.logoUpload ?? props.logo ?? props["Logo / Druckbild"]
  );
  const embossingLogoUrl = extractImageUrl(
    props.embossingLogoUrl ?? props.embossingLogo ?? props.praegung
  );
  const embossingMode = Boolean(props.embossingMode) || Boolean(embossingLogoUrl);
  const activeUrl = embossingMode ? embossingLogoUrl ?? printLogoUrl : printLogoUrl;
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
  const shape = props.shape ?? props.form ?? props["Form"] ?? props.formId ?? "ronde";
  const materialPreset = props.materialPreset ?? props.material ?? props["Material"] ?? "alu_g";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "group",
    {
      position: props.position,
      scale: [props.width ?? 1, props.height ?? 1, props.depth ?? 1],
      userData: { modelId: props.id },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SealFoil,
        {
          shape,
          diameterMm: props.diameterMm ?? 95,
          materialPreset,
          baseColor: props.baseColor,
          metalness: props.metalness,
          roughness: props.roughness,
          diffuseTexture,
          normalMap
        }
      )
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
    shape: {},
    diameterMm: {},
    materialPreset: {},
    baseColor: {},
    metalness: {},
    roughness: {},
    embossingMode: {},
    embossStrength: {},
    printLogoUrl: { type: "image" },
    embossingLogoUrl: { type: "image" }
  },
  defaultProps: {
    width: { expression: "1" },
    height: { expression: "1" },
    depth: { expression: "1" },
    shape: { expression: '"ronde"' },
    diameterMm: { expression: "95" },
    materialPreset: { expression: '"alu_g"' },
    baseColor: { expression: "null" },
    metalness: { expression: "null" },
    roughness: { expression: "null" },
    embossingMode: { expression: "false" },
    embossStrength: { expression: "4" },
    printLogoUrl: { expression: "null" },
    embossingLogoUrl: { expression: "null" }
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
