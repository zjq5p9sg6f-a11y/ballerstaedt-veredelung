import { a as index_cjs, b as ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__ } from './ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__-BrmfrqAs.js';

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
function jsxProd(type, config, maybeKey) {
  var key = null;
  undefined !== maybeKey && (key = "" + maybeKey);
  undefined !== config.key && (key = "" + config.key);
  if ("key" in config) {
    maybeKey = {};
    for (var propName in config)
      "key" !== propName && (maybeKey[propName] = config[propName]);
  } else maybeKey = config;
  config = maybeKey.ref;
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: undefined !== config ? config : null,
    props: maybeKey
  };
}
reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
reactJsxRuntime_production.jsx = jsxProd;
reactJsxRuntime_production.jsxs = jsxProd;

{
  jsxRuntime.exports = reactJsxRuntime_production;
}

var jsxRuntimeExports = jsxRuntime.exports;

// dev uses dynamic import to separate chunks
    
    const {loadShare: loadShare$2} = index_cjs;
    const {initPromise: initPromise$2} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res$2 = initPromise$2.then(_ => loadShare$2("@mui/material", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^7.1.1"
    }}}));
    const exportModule$2 = await res$2.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare___mf_0_mui_mf_1_material__loadShare__ = exportModule$2;

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
    
    const {loadShare: loadShare$1} = index_cjs;
    const {initPromise: initPromise$1} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res$1 = initPromise$1.then(_ => loadShare$1("react", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "19.1.1"
    }}}));
    const exportModule$1 = await res$1.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__ = exportModule$1;

// dev uses dynamic import to separate chunks
    
    const {loadShare} = index_cjs;
    const {initPromise} = ballerstaedt_mf_2_veredelung__mf_v__runtimeInit__mf_v__;
    const res = initPromise.then(_ => loadShare("three", {
    customShareInfo: {shareConfig:{
      singleton: true,
      strictVersion: false,
      requiredVersion: "^0.177.0"
    }}}));
    const exportModule = await res.then(factory => factory());
    var ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__ = exportModule;

const MM_TO_UNITS = 1 / 50;
function SealFoil(props) {
  const {
    shape = "round",
    diameterMm = 95,
    widthMm = 60,
    heightMm = 40,
    baseColor = "#cfcfcf",
    metalness = 0.85,
    roughness = 0.32
  } = props;
  const geometry = ballerstaedt_mf_2_veredelung__loadShare__react__loadShare__.useMemo(() => {
    if (shape === "round") {
      const r = diameterMm / 2 * MM_TO_UNITS;
      const g = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.CircleGeometry(r, 128);
      return g;
    }
    const w = widthMm / 2 * MM_TO_UNITS;
    const h = heightMm / 2 * MM_TO_UNITS;
    const s = new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.Shape();
    s.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
    return new ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.ShapeGeometry(s, 96);
  }, [shape, diameterMm, widthMm, heightMm]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "mesh",
    {
      geometry,
      rotation: [-Math.PI / 2, 0, 0],
      castShadow: true,
      receiveShadow: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "meshPhysicalMaterial",
        {
          color: baseColor,
          map: props.diffuseTexture ?? null,
          normalMap: props.normalMap ?? null,
          metalnessMap: props.metalnessMap ?? null,
          roughnessMap: props.roughnessMap ?? null,
          metalness,
          roughness,
          side: ballerstaedt_mf_2_veredelung__loadShare__three__loadShare__.DoubleSide,
          envMapIntensity: 1.2
        }
      )
    }
  );
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
    props.printLogoUrl ?? props.logoUpload ?? props.logo
  );
  const embossingLogoUrl = extractImageUrl(
    props.embossingLogoUrl ?? props.embossingLogo
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
        const norm = embossingMode ? await dataUrlToNormalMap(activeUrl, { strength: 4 }) : null;
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
  }, [activeUrl, embossingMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "group",
    {
      position: props.position,
      scale: [props.width ?? 1, props.height ?? 1, props.depth ?? 1],
      userData: { modelId: props.id },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SealFoil,
        {
          shape: props.shape ?? "round",
          diameterMm: props.diameterMm ?? 95,
          widthMm: props.widthMm ?? 60,
          heightMm: props.heightMm ?? 40,
          baseColor: props.baseColor ?? "#cfcfcf",
          metalness: props.metalness ?? 0.85,
          roughness: props.roughness ?? 0.32,
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
    baseColor: {},
    metalness: {},
    roughness: {},
    embossingMode: {},
    printLogoUrl: { type: "image" },
    embossingLogoUrl: { type: "image" }
  },
  defaultProps: {
    width: { expression: "1" },
    height: { expression: "1" },
    depth: { expression: "1" },
    shape: { expression: '"round"' },
    diameterMm: { expression: "95" },
    baseColor: { expression: '"#cfcfcf"' },
    metalness: { expression: "0.85" },
    roughness: { expression: "0.32" },
    embossingMode: { expression: "false" },
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
