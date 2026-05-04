# Ballerstaedt Veredelungs-Mockup (K3 Plugin)

Veredelungs-Erlebnis-Tool für Ballerstaedt-Siegelfolien. Kunde sieht Form, Material, Druck und Prägung live in 3D, bevor er bestellt.

## Stack

- React 19 + TypeScript
- Vite 6 + Module Federation (eingebettet in K3-Konfigurator als `remoteEntry.js`)
- React-Three-Fiber 9 + drei 10 (3D)
- MUI 7 (Konfigurations-UI)

## Setup

```bash
pnpm install
pnpm run build --watch &
pnpm run serve &
```

Plugin läuft dann unter `http://localhost:5002/remoteEntry.js`.

## Im K3-Konfigurator eintragen

K3-Backend → Konfigurator → Plugins → Neu:

- Development-URL: `http://localhost:5002/remoteEntry.js`
- Name: `ballerstaedt-veredelung`
- Module: `./Plugin`

## Phase 0 (aktuell)

- Parametrische Siegelfolien-Geometrie (rund / oval)
- Logo-Upload
- Logo als Druckbild ODER Blindprägung (Toggle `embossingMode`)
- Drehen, Skalieren via K3-Standard-Controls

## Phase 1 (nächst)

- Heißfolie-Bereich (Logo-Alpha als Maske + metallic Material)
- Spot-UV (Logo-Alpha + Roughness-Map)
- 3-5 Standard-Strukturprägungen aus Polyhaven-Library

## Phase 2 (später)

- Foto-zu-Normal-Workflow für BaCo-spezifische Strukturmuster
- Peel-Animation
