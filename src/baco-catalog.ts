// Master-Schema für Ballerstaedt-Konfigurator
// Quelle: K3-Konfigurator-Export 2026-05-04 + BaCo Basics 3.0 PDF S.42-45
// Direkt nutzbar in Standalone-Tool (Pages-Demo) und K3-Plugin (Legacy-Pfad)

export interface CatalogValue {
  id: string;        // interner key
  label: string;     // deutsche Anzeige
  code?: string;     // BaCo-Code (R, AR, AK, etc.)
}

export interface CatalogStep {
  id: string;
  label: string;
  variables: CatalogVariable[];
}

export interface CatalogVariable {
  id: string;
  label: string;
  type: "list" | "boolean" | "image" | "upload" | "number";
  values?: CatalogValue[];
}

// === SCHRITT 1 · FORM (8 Werte, BaCo-konform) ===
export const FORMEN: CatalogValue[] = [
  { id: "ronde",            label: "Ronde (rund)",           code: "R" },
  { id: "ronde-lasche",     label: "Ronde mit Lasche",       code: "AR" },
  { id: "kappe",            label: "Kappe",                  code: "K" },
  { id: "kappe-lasche",     label: "Kappe mit Lasche",       code: "AK" },
  { id: "verformt-lasche",  label: "Verformt mit Lasche",    code: "AL" },
  { id: "verformte-ronde",  label: "Verformte Ronde" },
  { id: "induktionssiegel", label: "Induktionssiegel",       code: "IR" },
  { id: "baco-bond",        label: "BaCo Bond (drucksensitive Einlage)", code: "R-R / PSL" },
];

// === SCHRITT 2 · PRÄGUNG (12 Werte, BaCo Basics 3.0 PDF S.44) ===
export const PRAEGUNGEN: CatalogValue[] = [
  { id: "glatt",           label: "Glatt (keine Prägung)" },
  { id: "leinen-damast",   label: "Leinen-Damast-Prägung",  code: "LD" },
  { id: "wuermchen",       label: "Würmchenprägung",        code: "WÜ" },
  { id: "puenktchen",      label: "Pünktchen-Prägung",      code: "PÜ" },
  { id: "nadelstich",      label: "Nadelstich-Prägung",     code: "NaP" },
  { id: "schriftzug",      label: "Schriftzug-Streuprägung",code: "G" },
  { id: "diamant-grob",    label: "Diamant-Prägung grob",   code: "Dia" },
  { id: "diamant-fein",    label: "Diamant-Prägung fein (Perldamast)", code: "Dia fein" },
  { id: "flachpraegung",   label: "Flachprägung" },
  { id: "werkzeug-logo",   label: "Werkzeug-Logo-Prägung" },
  { id: "erhabene-logo",   label: "Erhabene Logo-Prägung" },
  { id: "individuell",     label: "Individuell (auf Anfrage)" },
];

// === SCHRITT 3a · DRUCK-STIL (4 Werte) ===
export const DRUCK_STILE: CatalogValue[] = [
  { id: "keine",       label: "Keine Bedruckung" },
  { id: "zieldruck",   label: "Zieldruck (Tastmarken-Sensor, präzise Platzierung)" },
  { id: "streudruck",  label: "Streudruck (Muster wiederholt über Fläche)" },
  { id: "einfaerbung", label: "Einfärbung (vollflächig, kombinierbar)" },
];

// === SCHRITT 3b · DRUCK-VERFAHREN (2 Werte, BaCo-konform — Tiefdruck/Offset/Sieb gehören NICHT dazu) ===
export const DRUCK_VERFAHREN: CatalogValue[] = [
  { id: "digital",  label: "Digitaldruck (Durst Tau 330, Low-Migration, intern)" },
  { id: "flexo",    label: "Flexodruck (Dienstleister, Pantone, Großauflagen)" },
];

// === SCHRITT 4 · ANZAHL DRUCKFARBEN (5 Werte) ===
export const DRUCKFARBEN: CatalogValue[] = [
  { id: "1f",      label: "1-farbig" },
  { id: "2f",      label: "2-farbig" },
  { id: "3f",      label: "3-farbig" },
  { id: "4f-cmyk", label: "4-farbig (CMYK)" },
  { id: "sonder",  label: "Sonderfarbe (Pantone)" },
];

// === MATERIAL · Folien-Grundoptik (3 echte BaCo-Substrate + 3 Lack-Veredelungen) ===
export const MATERIALIEN: { id: string; label: string; color: number; metalness: number; roughness: number }[] = [
  { id: "alu_g",  label: "Aluminium glänzend", color: 0xd8d8d8, metalness: 0.92, roughness: 0.18 },
  { id: "alu_m",  label: "Aluminium matt",     color: 0xbdbdbd, metalness: 0.55, roughness: 0.6 },
  { id: "kunst",  label: "Kunststoff",         color: 0xf6f6f4, metalness: 0.0,  roughness: 0.65 },
  { id: "gold",   label: "Gold-Lack",          color: 0xd4af37, metalness: 1.0,  roughness: 0.15 },
  { id: "silber", label: "Silber-Lack",        color: 0xcfd6dd, metalness: 1.0,  roughness: 0.1 },
  { id: "kupfer", label: "Kupfer-Lack",        color: 0xb87333, metalness: 1.0,  roughness: 0.18 },
];

// === SCHRITTE · 4-Wizard-Struktur ===
export const SCHRITTE: CatalogStep[] = [
  { id: "form",         label: "1. Form",       variables: [{ id: "form",      label: "Form",       type: "list", values: FORMEN }] },
  { id: "praegung",     label: "2. Prägung",    variables: [{ id: "praegung",  label: "Prägung",    type: "list", values: PRAEGUNGEN }] },
  { id: "bedruckung",   label: "3. Bedruckung", variables: [
      { id: "druckstil",      label: "Druck-Stil",      type: "list", values: DRUCK_STILE },
      { id: "druckverfahren", label: "Druck-Verfahren", type: "list", values: DRUCK_VERFAHREN },
  ]},
  { id: "details",      label: "4. Logo & Details", variables: [
      { id: "logoDatei",   label: "Logo-Datei (PNG/JPG/SVG/PDF)", type: "upload" },
      { id: "druckfarben", label: "Anzahl Druckfarben",           type: "list", values: DRUCKFARBEN },
      { id: "mitLasche",   label: "Mit Lasche",                   type: "boolean" },
      { id: "stueckzahl",  label: "Stückzahl",                    type: "number" },
      { id: "logoDruckbild", label: "Logo / Druckbild",           type: "image" },
  ]},
];
