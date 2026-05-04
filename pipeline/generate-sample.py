"""
Test-STEP-Datei für Pipeline-Verifikation generieren.
Erzeugt eine einfache Folien-Geometrie als STEP — repräsentativ für BaCo-Siegelfolie.

Aufruf:
  FreeCADCmd generate-sample.py samples/test-folie.step

Geometrie: Disc Ø95mm, Dicke 0.5mm (typisch für Aluminium-Siegelfolie)
"""

import sys
import os
import FreeCAD
import Part


def generate_sample_folie(out_path: str, diameter_mm: float = 95.0, thickness_mm: float = 0.5):
    doc = FreeCAD.newDocument("sample")

    # Folie als flacher Zylinder (Disc mit minimaler Dicke)
    radius = diameter_mm / 2
    folie = Part.makeCylinder(radius, thickness_mm)

    # Optional: kleine Lasche andeuten (Trapez)
    lasche = Part.makeBox(18, 14, thickness_mm)
    lasche.translate(FreeCAD.Vector(radius - 1, -7, 0))
    folie_mit_lasche = folie.fuse(lasche)

    # Als Part-Objekt im Dokument ablegen
    obj = doc.addObject("Part::Feature", "Folie_Test_AR_95mm")
    obj.Shape = folie_mit_lasche
    doc.recompute()

    # STEP-Export
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    Part.export([obj], out_path)

    print(f"✓ Sample-STEP erzeugt: {out_path}")
    print(f"  Form: Ronde mit Lasche (AR), Ø{diameter_mm}mm × {thickness_mm}mm")
    print(f"  Volumen: {folie_mit_lasche.Volume:.1f} mm³")
    print(f"  BBox: {[round(x, 1) for x in [folie_mit_lasche.BoundBox.XLength, folie_mit_lasche.BoundBox.YLength, folie_mit_lasche.BoundBox.ZLength]]} mm")

    FreeCAD.closeDocument(doc.Name)


if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "samples/test-folie.step"
    generate_sample_folie(out_path)
