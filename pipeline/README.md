# STEP → glTF Pipeline · BaCo-Siegelfolien

Konvertiert Industrie-CAD-STEP-Dateien zu Web-optimierten glTF-Modellen für den Three.js-Konfigurator. Plus Metadaten-Extraktion (Volumen, BoundingBox, Vertex-Count).

## Stack

- **FreeCAD** (LGPL Open Source) für STEP-Parsing + Tessellation
- **trimesh** (Python, MIT) für STL→glTF-Konvertierung + Mesh-Repair

## Setup

```bash
# 1. FreeCAD installieren
brew install --cask freecad

# 2. Python-Tools-venv (falls nicht vorhanden)
python3 -m venv ~/Developer/tools-venv
source ~/Developer/tools-venv/bin/activate
pip install trimesh

# 3. Verify
which "/Applications/FreeCAD.app/Contents/Resources/bin/FreeCADCmd"
~/Developer/tools-venv/bin/python3 -c "import trimesh; print(trimesh.__version__)"
```

## Test-Lauf

```bash
cd ~/Developer/k3-plugins/ballerstaedt-veredelung/pipeline

# 1. Sample-STEP erzeugen
/Applications/FreeCAD.app/Contents/Resources/bin/FreeCADCmd \
  generate-sample.py samples/test-folie.step

# 2. Pipeline-Lauf
./batch.sh
```

Erwartetes Ergebnis:
```
output/
├── test-folie.stl          # Tesseliertes Mesh (FreeCAD)
├── test-folie.meta.json    # Volumen, BBox, Vertices
└── test-folie.glb          # Web-Optimiertes glTF
```

## Production-Workflow

BaCo liefert STEP-Dateien (eine pro Folien-SKU oder parametrisch pro Größe):

```
samples/
├── ronde-95mm.step
├── ronde-lasche-95mm.step
├── kappe-AK-50mm.step
└── ...
```

Pipeline-Lauf (ein Befehl):
```bash
./batch.sh
```

Output:
```
output/
├── ronde-95mm.glb          (3-50 KB pro Folie)
├── ronde-95mm.meta.json
├── ronde-lasche-95mm.glb
└── ...
```

Diese `.glb`-Files werden ins Web-Frontend kopiert (`public/models/`) und vom Three.js-Konfigurator dynamisch geladen via `useGLTF`.

## Tessellierungs-Parameter

`step2stl.py` Parameter `deflection` (Standard 0.05 mm):

| Wert | Qualität | Datei-Größe | Use-Case |
|---|---|---|---|
| 0.5 | grob | klein | mobile/Preview |
| 0.1 | mittel | mittel | Standard-Web |
| **0.05** | **fein** | **mittel** | **empfohlen für Veredelungs-Mockup** |
| 0.01 | sehr fein | groß | Print-Quality / Werkzeugbau |

## Metadaten-Output

Pro Folie wird eine `.meta.json` erzeugt:

```json
{
  "shape_count": 1,
  "volume_mm3": 3543.5,
  "surface_area_mm2": 14245.8,
  "bbox": {
    "min": [-47.5, -47.5, 0],
    "max": [47.5, 47.5, 0.5],
    "size": [95.0, 95.0, 0.5]
  },
  "tessellation": {
    "linear_deflection": 0.05,
    "vertex_count": 1248,
    "face_count": 2492
  }
}
```

→ Direkt nutzbar für:
- Catalog-Anzeige (Größe, Volumen)
- Material-Berechnung (Quadratmeter pro Folie)
- Pricing (Aluminium-Verbrauch)

## Skalierung

`stl2glb.py --scale 0.001` wandelt **mm → m**, weil Three.js-Welt typisch in Metern arbeitet. Wenn du STEP-Dateien in anderen Einheiten hast, Scale entsprechend anpassen:

| Quell-Einheit | --scale |
|---|---|
| mm | 0.001 |
| cm | 0.01 |
| m | 1.0 |
| inch | 0.0254 |

## Troubleshooting

**FreeCADCmd nicht gefunden:**
```bash
ls /Applications/FreeCAD.app/Contents/Resources/bin/
```
Falls FreeCAD installiert aber Pfad anders: in `batch.sh` `FREECAD_CMD` anpassen.

**STEP hat keine Shapes:**
Manche STEP-Dateien haben Assemblies (verschachtelte Strukturen). FreeCAD-Import sollte das auflösen, aber bei komplexen Files kann manueller Eingriff nötig sein.

**Mesh ist nicht watertight:**
`stl2glb.py` zeigt `watertight: false` an. Für Web-Display unkritisch, aber für 3D-Druck oder Volumen-Berechnung problematisch. trimesh hat `mesh.fill_holes()` als Reparatur-Schritt — kann bei Bedarf in `stl2glb.py` aktiviert werden.

## Roadmap

- [ ] STEP → glTF direkt (ohne STL-Zwischenschritt) via FreeCAD-importGLTF (ab v0.20)
- [ ] DXF-Generierung aus STEP (orthographische Projektion für 2D-Zeichnung)
- [ ] PDF-Datenblatt-Export aus Metadaten (via Doc-Engine)
- [ ] Auto-Catalog-Generierung (catalog.ts aus allen .meta.json-Files)
