"""
STEP → STL Konvertierung via FreeCAD-Headless

Aufruf:
  FreeCADCmd step2stl.py <input.step> <output.stl> [deflection]

Mac-Pfad zur FreeCADCmd:
  /Applications/FreeCAD.app/Contents/Resources/bin/FreeCADCmd

Beispiel:
  /Applications/FreeCAD.app/Contents/Resources/bin/FreeCADCmd \
    step2stl.py samples/folie.step output/folie.stl 0.05

Parameter:
  deflection: Tessellierungs-Genauigkeit (Standard 0.1 mm)
              kleinere Werte = feinere Geometrie + größere Datei
              0.05 für Web-Display empfohlen
              0.01 für Print-Quality
"""

import os
import sys
import json

# FreeCAD-Module (verfügbar nur in FreeCAD-Python-Context)
import FreeCAD
import Part
import Mesh
import MeshPart
import Import


def step_to_stl(step_path: str, stl_path: str, deflection: float = 0.05) -> dict:
    """
    Konvertiert STEP-Datei zu tesselliertem STL und gibt Metadaten zurück.

    Returns:
        dict mit 'shape_count', 'volume_mm3', 'bbox', 'surface_area_mm2'
    """
    if not os.path.exists(step_path):
        raise FileNotFoundError(f"STEP-Datei nicht gefunden: {step_path}")

    doc = FreeCAD.newDocument("conv")
    Import.insert(step_path, doc.Name)

    # Alle Shapes sammeln (STEP-Datei kann mehrere enthalten)
    shapes = []
    for obj in doc.Objects:
        if hasattr(obj, "Shape") and obj.Shape and not obj.Shape.isNull():
            shapes.append(obj.Shape)

    if not shapes:
        FreeCAD.closeDocument(doc.Name)
        raise ValueError(f"Keine gültigen Shapes in {step_path}")

    # Compound aus allen Shapes (falls mehrere Solids in einer Datei)
    compound = Part.makeCompound(shapes) if len(shapes) > 1 else shapes[0]

    # Tessellation: Shape → Mesh
    mesh = MeshPart.meshFromShape(
        Shape=compound,
        LinearDeflection=deflection,
        AngularDeflection=0.5,
        Relative=False,
    )

    # STL-Export
    os.makedirs(os.path.dirname(stl_path) or ".", exist_ok=True)
    mesh_obj = doc.addObject("Mesh::Feature", "tessellated")
    mesh_obj.Mesh = mesh
    Mesh.export([mesh_obj], stl_path)

    # Metadaten extrahieren
    bbox = compound.BoundBox
    metadata = {
        "shape_count": len(shapes),
        "volume_mm3": round(compound.Volume, 3),
        "surface_area_mm2": round(compound.Area, 3),
        "bbox": {
            "min": [round(bbox.XMin, 3), round(bbox.YMin, 3), round(bbox.ZMin, 3)],
            "max": [round(bbox.XMax, 3), round(bbox.YMax, 3), round(bbox.ZMax, 3)],
            "size": [round(bbox.XLength, 3), round(bbox.YLength, 3), round(bbox.ZLength, 3)],
        },
        "tessellation": {
            "linear_deflection": deflection,
            "vertex_count": mesh.CountPoints,
            "face_count": mesh.CountFacets,
        },
    }

    FreeCAD.closeDocument(doc.Name)
    return metadata


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: FreeCADCmd step2stl.py <input.step> <output.stl> [deflection]")
        sys.exit(1)

    step_path = sys.argv[1]
    stl_path = sys.argv[2]
    deflection = float(sys.argv[3]) if len(sys.argv) > 3 else 0.05

    print(f"[step2stl] Konvertiere: {step_path} → {stl_path}")
    print(f"[step2stl] Deflection: {deflection} mm")

    try:
        meta = step_to_stl(step_path, stl_path, deflection)
        print(f"[step2stl] ✓ STL geschrieben")
        print(f"[step2stl] Shape-Count: {meta['shape_count']}")
        print(f"[step2stl] Volumen: {meta['volume_mm3']:.1f} mm³")
        print(f"[step2stl] Oberfläche: {meta['surface_area_mm2']:.1f} mm²")
        print(f"[step2stl] BBox: {meta['bbox']['size']} mm")
        print(f"[step2stl] Vertices: {meta['tessellation']['vertex_count']}")
        print(f"[step2stl] Faces: {meta['tessellation']['face_count']}")

        # Metadaten-JSON daneben speichern
        meta_path = stl_path.rsplit(".", 1)[0] + ".meta.json"
        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)
        print(f"[step2stl] ✓ Metadata: {meta_path}")
    except Exception as e:
        print(f"[step2stl] ✗ FEHLER: {e}", file=sys.stderr)
        sys.exit(2)
