// @ts-nocheck
// GLB-Loader für STEP-CAD-konvertierte Siegelverschluss-Formen.
// GLB-Skala: 1 mm = 0.001 (Pipeline stl2glb mm→m). Tool-Welt: 1 mm = 0.01.
// Skalierungs-Faktor: 10. Plus optionale Größen-Skalierung über diameterMm.
import * as THREE from "three";
import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

// Tool-Welt-Skala (matched zu MM-Konstante in seal-foil-geometry.ts)
const SCENE_MM = 0.01;
// GLB-Welt-Skala (Pipeline stl2glb)
const GLB_MM = 0.001;
// Korrektur: GLB → Scene
const GLB_TO_SCENE = SCENE_MM / GLB_MM; // = 10

// CAD-Modelle haben typischerweise ~53 mm Durchmesser (BaCo-Standard-Form)
const CAD_REFERENCE_DIAMETER_MM = 53;

export interface SealFoilGLBProps {
  url: string;
  material: THREE.Material;
  diameterMm?: number;
}

export function SealFoilGLB({ url, material, diameterMm = 95 }: SealFoilGLBProps) {
  const gltf = useGLTF(url) as any;

  const cloned = useMemo(() => {
    const c = gltf.scene.clone(true);
    c.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.material = material;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return c;
  }, [gltf.scene, material]);

  const scale = useMemo(() => {
    // Faktor 10 (GLB→Scene) × (gewünschter Durchmesser / CAD-Referenz)
    return GLB_TO_SCENE * (diameterMm / CAD_REFERENCE_DIAMETER_MM);
  }, [diameterMm]);

  return <primitive object={cloned} scale={[scale, scale, scale]} />;
}

// Preload damit Form-Switch keinen Loading-Flicker hat
useGLTF.preload("/models/kappe.glb");
useGLTF.preload("/models/kappe-lasche.glb");
useGLTF.preload("/models/verformt-lasche.glb");
useGLTF.preload("/models/verformte-ronde.glb");
