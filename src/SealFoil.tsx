// @ts-nocheck
import * as THREE from "three";
import { useMemo } from "react";
import {
  buildSealFoil,
  normalizeShape,
  normalizeMaterial,
  type ShapeId,
} from "./seal-foil-geometry";

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

  const group = useMemo(() => {
    return buildSealFoil({
      shape: normalizedShape,
      diameterMm,
      material,
    });
  }, [normalizedShape, diameterMm, material]);

  // Cleanup on unmount / re-build
  // (useMemo regenerates group; old group's geometries+material get replaced — three.js
  // garbage collects when references drop, but explicit dispose would be safer in a
  // long-running session — Phase 1 polish.)

  return <primitive object={group} />;
}
