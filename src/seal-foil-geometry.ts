// @ts-nocheck
import * as THREE from "three";

// 1 mm = 0.01 scene-units (matched to demo-main)
const MM = 0.01;

export type ShapeId =
  | "ronde"
  | "ronde-lasche"
  | "kappe"
  | "kappe-lasche"
  | "verformt-lasche"
  | "verformte-ronde"
  | "induktionssiegel"
  | "baco-bond";

export interface SealFoilOptions {
  shape: ShapeId;
  diameterMm: number;
  material: THREE.Material;
}

function laschePath(shape: THREE.Shape, edgeR: number, side: "right" | "left" = "right") {
  const w = 14 * MM, h = 18 * MM;
  const sx = side === "right" ? edgeR : -edgeR;
  const dir = side === "right" ? 1 : -1;
  shape.moveTo(sx, -w / 2);
  shape.lineTo(sx + dir * h * 0.6, (-w / 2) * 0.85);
  shape.quadraticCurveTo(sx + dir * h, 0, sx + dir * h * 0.6, (w / 2) * 0.85);
  shape.lineTo(sx, w / 2);
}

function rondeGeo(diameterMm: number, withLasche: boolean) {
  const r = (diameterMm / 2) * MM;
  const shape = new THREE.Shape();
  if (withLasche) {
    const angleStart = Math.asin((14 * MM / 2) / r) || 0.08;
    shape.absarc(0, 0, r, angleStart, 2 * Math.PI - angleStart, false);
    laschePath(shape, r * Math.cos(angleStart), "right");
    shape.lineTo(r * Math.cos(angleStart), -r * Math.sin(angleStart));
  } else {
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  }
  return new THREE.ShapeGeometry(shape, 96);
}

function ovalGeo(diameterMm: number, withLasche: boolean) {
  const w = (diameterMm / 2) * MM;
  const h = (diameterMm / 2) * MM * 0.7;
  const shape = new THREE.Shape();
  if (withLasche) {
    const angleStart = 0.18;
    shape.absellipse(0, 0, w, h, angleStart, 2 * Math.PI - angleStart, false, 0);
    laschePath(shape, w * Math.cos(angleStart), "right");
    shape.lineTo(w * Math.cos(angleStart), -h * Math.sin(angleStart));
  } else {
    shape.absellipse(0, 0, w, h, 0, Math.PI * 2, false, 0);
  }
  return new THREE.ShapeGeometry(shape, 96);
}

function buildFlatFoil(geometry: THREE.BufferGeometry, material: THREE.Material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

function buildKappe(diameterMm: number, material: THREE.Material, withLasche: boolean) {
  const r = (diameterMm / 2) * MM;
  const group = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(r, 96, 32, 0, Math.PI * 2, 0, Math.PI / 3.5);
  const sphere = new THREE.Mesh(sphereGeo, material);
  sphere.scale.y = 0.35;
  group.add(sphere);
  const baseGeo = new THREE.CircleGeometry(r, 96);
  const base = new THREE.Mesh(baseGeo, material);
  base.rotation.x = -Math.PI / 2;
  group.add(base);
  if (withLasche) {
    const laschenShape = new THREE.Shape();
    laschePath(laschenShape, r, "right");
    laschenShape.lineTo(r, -7 * MM);
    const laschenGeo = new THREE.ShapeGeometry(laschenShape, 16);
    const lasche = new THREE.Mesh(laschenGeo, material);
    lasche.rotation.x = -Math.PI / 2;
    group.add(lasche);
  }
  return group;
}

function buildInduktion(diameterMm: number, material: THREE.MeshPhysicalMaterial) {
  const r = (diameterMm / 2) * MM;
  const group = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 96), material);
  disc.rotation.x = -Math.PI / 2;
  group.add(disc);
  const innerR = r * 0.7;
  const ringGeo = new THREE.RingGeometry(innerR * 0.92, innerR, 96);
  const ringMat = (material as any).clone
    ? (material as any).clone()
    : new THREE.MeshPhysicalMaterial({});
  if (ringMat.color && ringMat.color.set) ringMat.color.set(0x8a8a8a);
  if (typeof ringMat.metalness === "number") ringMat.metalness = Math.min((material as any).metalness + 0.05, 1);
  if (typeof ringMat.roughness === "number") ringMat.roughness = Math.max((material as any).roughness - 0.1, 0.05);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.001;
  group.add(ring);
  return group;
}

function buildBacoBond(diameterMm: number, material: THREE.Material) {
  const r = (diameterMm / 2) * MM;
  const group = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CircleGeometry(r, 96), material);
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.008;
  group.add(top);
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

function buildRollenware(diameterMm: number, material: THREE.Material) {
  const r = (diameterMm / 2) * MM;
  const len = r * 4;
  const group = new THREE.Group();
  const cylGeo = new THREE.CylinderGeometry(r * 0.85, r * 0.85, r * 0.6, 96, 1, true);
  const cyl = new THREE.Mesh(cylGeo, material);
  cyl.rotation.z = Math.PI / 2;
  cyl.position.set(-len * 0.35, r * 0.3, 0);
  group.add(cyl);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xb38e5d,
    metalness: 0.1,
    roughness: 0.9,
  });
  const cap1 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.85, 64), coreMat);
  cap1.rotation.y = Math.PI / 2;
  cap1.position.set(-len * 0.35 + r * 0.301, r * 0.3, 0);
  group.add(cap1);
  const cap2 = new THREE.Mesh(new THREE.CircleGeometry(r * 0.85, 64), coreMat);
  cap2.rotation.y = -Math.PI / 2;
  cap2.position.set(-len * 0.35 - r * 0.301, r * 0.3, 0);
  group.add(cap2);
  const planeGeo = new THREE.PlaneGeometry(len * 0.8, r * 0.6);
  const plane = new THREE.Mesh(planeGeo, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(len * 0.05, 0, 0);
  group.add(plane);
  return group;
}

export function buildSealFoil(opts: SealFoilOptions): THREE.Group {
  const { shape, diameterMm, material } = opts;
  switch (shape) {
    case "ronde":            return buildFlatFoil(rondeGeo(diameterMm, false), material);
    case "ronde-lasche":     return buildFlatFoil(rondeGeo(diameterMm, true),  material);
    case "kappe":            return buildKappe(diameterMm, material, false);
    case "kappe-lasche":     return buildKappe(diameterMm, material, true);
    case "verformt-lasche":  return buildFlatFoil(ovalGeo(diameterMm, true),   material);
    case "verformte-ronde":  return buildFlatFoil(ovalGeo(diameterMm, false),  material);
    case "induktionssiegel": return buildInduktion(diameterMm, material as THREE.MeshPhysicalMaterial);
    case "baco-bond":        return buildBacoBond(diameterMm, material);
    default:                 return buildFlatFoil(rondeGeo(diameterMm, false), material);
  }
}

// === Shape normalization · K3 may send: string-label, string-id, number-index, or object{value/label/id} ===
const SHAPE_INDEX_MAP: ShapeId[] = [
  "ronde",
  "ronde-lasche",
  "kappe",
  "kappe-lasche",
  "verformt-lasche",
  "verformte-ronde",
  "induktionssiegel",
  "baco-bond",
];

export function normalizeShape(raw: any): ShapeId {
  if (raw === null || raw === undefined) return "ronde";

  // Numeric index from K3 select-variable (0-based or 1-based)
  if (typeof raw === "number") {
    if (raw >= 0 && raw < SHAPE_INDEX_MAP.length) return SHAPE_INDEX_MAP[raw];
    if (raw >= 1 && raw <= SHAPE_INDEX_MAP.length) return SHAPE_INDEX_MAP[raw - 1];
    return "ronde";
  }

  // Object wrapper from K3 — extract underlying value
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.value !== undefined) return normalizeShape(raw.value);
    if (raw.label !== undefined) return normalizeShape(raw.label);
    if (raw.name !== undefined) return normalizeShape(raw.name);
    if (raw.id !== undefined) return normalizeShape(raw.id);
    if (raw.code !== undefined) return normalizeShape(raw.code);
    if (raw.text !== undefined) return normalizeShape(raw.text);
    return "ronde";
  }

  // Array (multi-select with single value)
  if (Array.isArray(raw) && raw.length > 0) {
    return normalizeShape(raw[0]);
  }

  const s = String(raw).toLowerCase().trim();

  // Direct match on internal IDs
  const idMatch: ShapeId[] = [
    "ronde-lasche",
    "kappe-lasche",
    "verformt-lasche",
    "verformte-ronde",
    "induktionssiegel",
    "baco-bond",
    "kappe",
    "ronde",
  ];
  for (const id of idMatch) {
    if (s === id) return id;
  }

  // Heuristic on label/code keywords (BaCo-Codes from PDF S.42)
  if (s.includes("psl") || s.includes("baco bond") || s.includes("baco-bond") || s.includes("r-r")) return "baco-bond";
  if (s.includes("induktion") || s === "ir" || s.startsWith("ir ") || s.endsWith(" ir")) return "induktionssiegel";
  if (s.includes("verformt") && s.includes("lasche")) return "verformt-lasche";
  if (s.includes("verformt") || s.includes("oval")) return "verformte-ronde";
  if (s.includes("kappe") && s.includes("lasche")) return "kappe-lasche";
  if (s.includes("kappe") || s === "k") return "kappe";
  if ((s.includes("ronde") || s.includes("flachplatine") || s === "ar") && s.includes("lasche")) return "ronde-lasche";
  return "ronde";
}

// === Material presets matching demo-main palette ===
export interface MaterialPreset {
  id: string;
  label: string;
  color: number;
  metalness: number;
  roughness: number;
}

export const MATERIAL_PRESETS: MaterialPreset[] = [
  { id: "alu_g",  label: "Alu glänzend",  color: 0xd8d8d8, metalness: 0.92, roughness: 0.18 },
  { id: "alu_m",  label: "Alu matt",      color: 0xbdbdbd, metalness: 0.55, roughness: 0.6 },
  { id: "kunst",  label: "Kunststoff",    color: 0xf6f6f4, metalness: 0.0,  roughness: 0.65 },
  { id: "gold",   label: "Gold-Lack",     color: 0xd4af37, metalness: 1.0,  roughness: 0.15 },
  { id: "silber", label: "Silber-Lack",   color: 0xcfd6dd, metalness: 1.0,  roughness: 0.1 },
  { id: "kupfer", label: "Kupfer-Lack",   color: 0xb87333, metalness: 1.0,  roughness: 0.18 },
];

export function normalizeMaterial(raw: any): MaterialPreset {
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
