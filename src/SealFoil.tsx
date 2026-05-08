// @ts-nocheck
import * as THREE from "three";
import { useMemo } from "react";
import {
  buildSealFoil,
  normalizeShape,
  normalizeMaterial,
  type ShapeId,
} from "./seal-foil-geometry";
import { SealFoilGLB } from "./SealFoilGLB";
import { SealFoilSTEP } from "./SealFoilSTEP";

// Form-IDs die eine STEP-Datei unter /step/ haben.
// Direct-STEP-Loader nutzt occt-import-js (Open CASCADE WASM) → keine
// Tessellations-Verluste, respektiert Original-Achsen + Multi-Solid-Strukturen.
const FORM_STEP_MAP: Record<string, string> = {
  "kappe":            "/step/kappe.stp",
  "kappe-lasche":     "/step/kappe-lasche.stp",
  "verformt-lasche":  "/step/verformt-lasche.stp",
  "verformte-ronde":  "/step/verformte-ronde.stp",
};

// Fallback: pre-tessellierte GLBs (falls STEP-Loader fehlschlaegt)
const FORM_GLB_MAP: Record<string, string> = {
  "kappe":            "/models/kappe.glb",
  "kappe-lasche":     "/models/kappe-lasche.glb",
  "verformt-lasche":  "/models/verformt-lasche.glb",
  "verformte-ronde":  "/models/verformte-ronde.glb",
};

export interface SealFoilProps {
  shape?: ShapeId | string;
  diameterMm?: number;
  materialPreset?: string;
  baseColor?: string | number;
  metalness?: number;
  roughness?: number;
  diffuseTexture?: THREE.Texture | null;
  normalMap?: THREE.Texture | null;
  metalnessMap?: THREE.Texture | null;
  roughnessMap?: THREE.Texture | null;
}

export function SealFoil(props: SealFoilProps) {
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
    roughnessMap,
  } = props;

  const normalizedShape = normalizeShape(shape);

  // Material: priority is explicit color/metalness/roughness, then preset, then default
  const material = useMemo(() => {
    const preset = normalizeMaterial(materialPreset);
    const m = new THREE.MeshPhysicalMaterial({
      color:
        baseColor !== undefined
          ? new THREE.Color(baseColor as any)
          : new THREE.Color(preset.color),
      metalness: metalness ?? preset.metalness,
      roughness: roughness ?? preset.roughness,
      side: THREE.DoubleSide,
      envMapIntensity: 1.4,
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
    roughnessMap,
  ]);

  // Bevorzugt: STEP-Direct-Loader (volle CAD-Genauigkeit, originale Achsen).
  // Fallback bei Lade-Fehler: vorab-tesselliertes GLB.
  // Wenn keines: parametrische Geometrie.
  const stepUrl = FORM_STEP_MAP[normalizedShape];
  const glbUrl = FORM_GLB_MAP[normalizedShape];

  // eslint-disable-next-line no-console
  console.log("[SealFoil] shape=", shape, "→ normalized=", normalizedShape, "→ stepUrl=", stepUrl, "glbUrl=", glbUrl);

  const group = useMemo(() => {
    if (stepUrl || glbUrl) return null;
    return buildSealFoil({
      shape: normalizedShape,
      diameterMm,
      material,
    });
  }, [normalizedShape, diameterMm, material, stepUrl, glbUrl]);

  if (stepUrl) {
    return <SealFoilSTEP url={stepUrl} material={material} diameterMm={diameterMm} />;
  }
  if (glbUrl) {
    return <SealFoilGLB url={glbUrl} material={material} diameterMm={diameterMm} />;
  }
  return <primitive object={group} />;
}
