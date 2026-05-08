// @ts-nocheck
// Direct-STEP-Loader via occt-import-js (Open CASCADE WASM).
// Lädt CAD-Datei direkt im Browser ohne Tessellations-Verlust.
//
// Performance: Geometrie-Cache + Preload aller bekannten Formen beim ersten
// Mount → Form-Switch ist instant statt 1-3s WASM/Parse-Roundtrip.
// Material bleibt prop-gesteuert (separates Mount-Cycle).
import * as THREE from "three";
import { useEffect, useMemo, useState } from "react";

// ===== Singleton WASM-Init (occt nur 1× geladen) =====
let occtPromise: Promise<any> | null = null;
function loadOcct(): Promise<any> {
  if (occtPromise) return occtPromise;
  occtPromise = new Promise((resolve, reject) => {
    if ((window as any).occtimportjs) {
      (window as any).occtimportjs().then(resolve).catch(reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "/occt-import-js.js";
    script.onload = () => {
      (window as any).occtimportjs().then(resolve).catch(reject);
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
  return occtPromise;
}

// ===== Geometrie-Cache (URL → BufferGeometry + BBox) =====
type CachedGeo = {
  geometries: THREE.BufferGeometry[];
  bbox: THREE.Box3;
  cadDiameterMm: number;
};
const geoCache: Map<string, Promise<CachedGeo>> = new Map();

async function loadStepGeometry(url: string): Promise<CachedGeo> {
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
      angularDeflection: 0.1,
    });
    if (!result.success) throw new Error(`occt parse failed: ${url}`);

    const geometries: THREE.BufferGeometry[] = [];
    const bbox = new THREE.Box3();
    for (const m of result.meshes) {
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(m.attributes.position.array, 3)
      );
      if (m.attributes.normal) {
        g.setAttribute(
          "normal",
          new THREE.Float32BufferAttribute(m.attributes.normal.array, 3)
        );
      }
      if (m.index) {
        const idx = Uint32Array.from(m.index.array);
        g.setIndex(new THREE.BufferAttribute(idx, 1));
      }
      if (!m.attributes.normal) g.computeVertexNormals();
      g.computeBoundingBox();
      bbox.union(g.boundingBox!);
      geometries.push(g);
    }
    const size = bbox.getSize(new THREE.Vector3());
    const cadDiameterMm = Math.max(size.x, size.y, size.z);
    return { geometries, bbox, cadDiameterMm };
  })();

  geoCache.set(url, p);
  return p;
}

// ===== Preload (alle vier Formen beim ersten Mount, ohne Block) =====
let preloadStarted = false;
function preloadAll() {
  if (preloadStarted) return;
  preloadStarted = true;
  const urls = [
    "/step/kappe.stp",
    "/step/kappe-lasche.stp",
    "/step/verformt-lasche.stp",
    "/step/verformte-ronde.stp",
  ];
  for (const u of urls) {
    loadStepGeometry(u).catch(() => { /* swallow, retry on demand */ });
  }
}

// ===== Tool-Welt Skala =====
const SCENE_MM = 0.01;
const CAD_REFERENCE_DIAMETER_MM = 53;

export interface SealFoilSTEPProps {
  url: string;
  material: THREE.Material;
  diameterMm?: number;
}

export function SealFoilSTEP({ url, material, diameterMm = 95 }: SealFoilSTEPProps) {
  const [geo, setGeo] = useState<CachedGeo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    preloadAll();
  }, []);

  // Geometrie laden (geht aus Cache wenn schon da → instant)
  useEffect(() => {
    let cancelled = false;
    setGeo(null);
    setError(null);
    loadStepGeometry(url)
      .then((g) => { if (!cancelled) setGeo(g); })
      .catch((e) => {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error("[SealFoilSTEP]", url, e);
        setError(String(e?.message || e));
      });
    return () => { cancelled = true; };
  }, [url]);

  // Group + Mesh aus Cache-Geometry + aktuellem Material bauen.
  // Re-render wenn material oder diameterMm wechselt — kein WASM-Reload.
  const group = useMemo(() => {
    if (!geo) return null;
    const inner = new THREE.Group();
    for (const g of geo.geometries) {
      const mesh = new THREE.Mesh(g, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      inner.add(mesh);
    }
    // Zentrieren (BBox-Mitte → Origin)
    const center = geo.bbox.getCenter(new THREE.Vector3());
    inner.position.sub(center);
    // Outer für Skalierung (damit position.sub und scale unabhängig sind)
    const outer = new THREE.Group();
    outer.add(inner);
    const finalScale = (diameterMm * SCENE_MM) / CAD_REFERENCE_DIAMETER_MM;
    outer.scale.setScalar(finalScale);
    return outer;
  }, [geo, material, diameterMm]);

  if (error) return null;
  if (!group) return null;
  return <primitive object={group} />;
}

// Public API: explicit preload-Trigger (z.B. beim App-Mount)
export const sealFoilSTEPPreload = preloadAll;
