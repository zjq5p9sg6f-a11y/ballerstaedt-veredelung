// @ts-nocheck
import { useEffect, useState, useMemo } from "react";
import { Html } from "@react-three/drei";
import { DynamicModel } from "k3-plugin-api";
import { SealFoil } from "./SealFoil";
import {
  dataUrlToDiffuseTexture,
  dataUrlToNormalMap,
} from "./utils/imageToNormalMap";
import { normalizeShape, normalizeMaterial } from "./seal-foil-geometry";
import screenshot from "../public/Image.png";

const extractImageUrl = (val: any): string | undefined => {
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

// === Multi-path resolver: K3 may propagate variable values via different routes ===
// Tries direct property, then context, then materialActions/colorActions/printActions,
// then recursive search for any value matching shape/material patterns.
function resolveValueFromAnyPath(
  props: any,
  candidates: string[],
  validator?: (v: any) => boolean,
): { value: any; source: string } {
  // 1. Direct prop access
  for (const key of candidates) {
    const v = props?.[key];
    if (v !== undefined && v !== null && (!validator || validator(v))) {
      return { value: v, source: `props.${key}` };
    }
  }
  // 2. Via context object
  if (props?.context && typeof props.context === "object") {
    for (const key of candidates) {
      const v = props.context[key];
      if (v !== undefined && v !== null && (!validator || validator(v))) {
        return { value: v, source: `props.context.${key}` };
      }
    }
  }
  // 3. Via slots (K3 may store linked variables here)
  if (props?.slots && typeof props.slots === "object") {
    for (const key of candidates) {
      const v = props.slots[key];
      if (v !== undefined && v !== null && (!validator || validator(v))) {
        return { value: v, source: `props.slots.${key}` };
      }
    }
  }
  // 4. Action arrays often carry { id, value, label } objects
  for (const actionKey of ["materialActions", "colorActions", "printActions"]) {
    const arr = props?.[actionKey];
    if (Array.isArray(arr)) {
      for (const a of arr) {
        if (!a) continue;
        for (const key of candidates) {
          if (a.id === key || a.name === key || a.key === key) {
            const v = a.value ?? a.selected ?? a.current;
            if (v !== undefined && v !== null && (!validator || validator(v))) {
              return { value: v, source: `${actionKey}[${key}].value` };
            }
          }
        }
      }
    }
  }
  return { value: undefined, source: "default" };
}

const SealFoilDynamic = (props: any) => {
  const [diffuseTexture, setDiffuseTexture] = useState<any>(null);
  const [normalMap, setNormalMap] = useState<any>(null);

  // === Multi-path resolution: try every plausible K3 channel ===
  const shapeRes = useMemo(
    () =>
      resolveValueFromAnyPath(props, [
        "shape",
        "form",
        "Form",
        "Form_value",
        "FormValue",
        "FormIndex",
        "shape_id",
      ]),
    [props.shape, props.form, props.Form, props.context, props.slots, props.materialActions]
  );

  const materialRes = useMemo(
    () =>
      resolveValueFromAnyPath(props, [
        "materialPreset",
        "material",
        "Material",
        "MaterialIndex",
        "MaterialPreset",
      ]),
    [props.materialPreset, props.material, props.Material, props.context, props.slots, props.materialActions]
  );

  const printLogoRaw =
    props.printLogoUrl ??
    props.logoUpload ??
    props.logo ??
    props.Logo_Druckbild ??
    props["Logo / Druckbild"] ??
    props.context?.Logo_Druckbild ??
    props.context?.printLogo;
  const printLogoUrl = extractImageUrl(printLogoRaw);

  const embossingRaw =
    props.embossingLogoUrl ??
    props.embossingLogo ??
    props.praegung ??
    props["Prägung"] ??
    props.context?.praegung;
  const embossingLogoUrl = extractImageUrl(embossingRaw);

  const embossingMode: boolean =
    Boolean(props.embossingMode) || Boolean(embossingLogoUrl);
  const activeUrl = embossingMode ? embossingLogoUrl ?? printLogoUrl : printLogoUrl;

  const normalizedShape = normalizeShape(shapeRes.value);
  const normalizedMaterial = normalizeMaterial(materialRes.value);

  if (typeof window !== "undefined") {
    /* eslint-disable no-console */
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
    /* eslint-enable no-console */
  }

  useEffect(() => {
    let cancelled = false;
    if (!activeUrl) {
      setDiffuseTexture(null);
      setNormalMap(null);
      return;
    }
    (async () => {
      try {
        const diff = await dataUrlToDiffuseTexture(activeUrl);
        const norm = embossingMode
          ? await dataUrlToNormalMap(activeUrl, { strength: props.embossStrength ?? 4.0 })
          : null;
        if (cancelled) return;
        setDiffuseTexture(embossingMode ? null : diff);
        setNormalMap(norm);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[SealFoilPlugin] texture-load failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUrl, embossingMode, props.embossStrength]);

  // Internal state fallback: if K3 variable binding doesn't propagate,
  // user can click forms directly in 3D-overlay
  const [internalShape, setInternalShape] = useState<string | null>(null);
  const effectiveShape = internalShape ?? normalizedShape;

  const SHAPES = [
    { id: "ronde", label: "Ronde", code: "R" },
    { id: "ronde-lasche", label: "Ronde·Lasche", code: "AR" },
    { id: "kappe", label: "Kappe", code: "K" },
    { id: "kappe-lasche", label: "Kappe·Lasche", code: "AK" },
    { id: "verformt-lasche", label: "AL · Tiefgezogen·Lasche", code: "AL" },
    { id: "verformte-ronde", label: "Tiefgezogen", code: "—" },
  ];

  return (
    <group
      position={props.position}
      scale={[props.width ?? 1, props.height ?? 1, props.depth ?? 1]}
      userData={{ modelId: props.id }}
    >
      <SealFoil
        shape={effectiveShape as any}
        diameterMm={props.diameterMm ?? 95}
        materialPreset={normalizedMaterial.id}
        baseColor={props.baseColor}
        metalness={props.metalness}
        roughness={props.roughness}
        diffuseTexture={diffuseTexture}
        normalMap={normalMap}
      />
      {/* Floating Form-Picker — direct interaction in 3D, bypasses K3 variable system */}
      <Html position={[0, 0.85, 0]} center distanceFactor={6} occlude={false}>
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 6,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: 8,
            border: "1px solid rgba(212,175,55,0.4)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
            userSelect: "none",
          }}
        >
          {SHAPES.map((s) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                setInternalShape(s.id);
              }}
              style={{
                background:
                  effectiveShape === s.id ? "#d4af37" : "rgba(255,255,255,0.08)",
                color: effectiveShape === s.id ? "#1a1a1a" : "white",
                border: "none",
                padding: "5px 9px",
                borderRadius: 5,
                fontSize: 10,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              title={`${s.label} (${s.code})`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Html>
    </group>
  );
};

export const dynamicSealFoil: DynamicModel = {
  type: "sealFoilPlugin",
  label: "Siegelfolie",
  disabledForAR: false,
  component: SealFoilDynamic,
  propsDialog: {
    basic: { type: "basic" },
    // Variable-Selektor-Dropdown im Admin-UI · saubere Bindung statt Formel-Editor
    shape:          { type: "variable", label: "Form",     allowedTypes: ["list"] },
    materialPreset: { type: "variable", label: "Material", allowedTypes: ["list"] },
    embossingMode:  { type: "variable", label: "Prägung",  allowedTypes: ["list", "boolean"] },
    printLogoUrl:   { type: "variable", label: "Druck-Logo",     allowedTypes: ["image", "upload"] },
    embossingLogoUrl: { type: "variable", label: "Prägung-Logo", allowedTypes: ["image", "upload"] },
    // Numerische Direkt-Properties (Expressions OK weil keine Variable-Bindung nötig)
    diameterMm:     { type: "expression", label: "Durchmesser (mm)" },
    metalness:      { type: "expression", label: "Metallizität" },
    roughness:      { type: "expression", label: "Rauheit" },
    embossStrength: { type: "expression", label: "Prägetiefe" },
  },
  defaultProps: {
    // K3 verlangt numerische Formel-Ergebnisse — alle Defaults als Number.
    // Strings würden Fehler "Formel muss Zahlenwert sein" werfen.
    width: { expression: "1" },
    height: { expression: "1" },
    depth: { expression: "1" },
    shape: { expression: "0" },           // 0 = Ronde (siehe SHAPE_INDEX_MAP)
    diameterMm: { expression: "95" },
    materialPreset: { expression: "0" },  // 0 = Alu glänzend (siehe MATERIAL_PRESETS)
    metalness: { expression: "0.85" },
    roughness: { expression: "0.32" },
    embossingMode: { expression: "0" },   // 0 = false / 1 = true
    embossStrength: { expression: "4" },
  },
  materials: ["body"],
  screenshot,
};
