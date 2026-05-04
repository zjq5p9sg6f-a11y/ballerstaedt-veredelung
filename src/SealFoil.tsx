// @ts-nocheck
import * as THREE from "three";
import { useMemo } from "react";

export interface SealFoilProps {
  shape?: "round" | "oval";
  diameterMm?: number;
  widthMm?: number;
  heightMm?: number;
  diffuseTexture?: THREE.Texture | null;
  normalMap?: THREE.Texture | null;
  metalnessMap?: THREE.Texture | null;
  roughnessMap?: THREE.Texture | null;
  baseColor?: string;
  metalness?: number;
  roughness?: number;
}

const MM_TO_UNITS = 1 / 50;

export function SealFoil(props: SealFoilProps) {
  const {
    shape = "round",
    diameterMm = 95,
    widthMm = 60,
    heightMm = 40,
    baseColor = "#cfcfcf",
    metalness = 0.85,
    roughness = 0.32,
  } = props;

  const geometry = useMemo(() => {
    if (shape === "round") {
      const r = (diameterMm / 2) * MM_TO_UNITS;
      const g = new THREE.CircleGeometry(r, 128);
      return g;
    }
    const w = (widthMm / 2) * MM_TO_UNITS;
    const h = (heightMm / 2) * MM_TO_UNITS;
    const s = new THREE.Shape();
    s.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
    return new THREE.ShapeGeometry(s, 96);
  }, [shape, diameterMm, widthMm, heightMm]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={baseColor}
        map={props.diffuseTexture ?? null}
        normalMap={props.normalMap ?? null}
        metalnessMap={props.metalnessMap ?? null}
        roughnessMap={props.roughnessMap ?? null}
        metalness={metalness}
        roughness={roughness}
        side={THREE.DoubleSide}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}
