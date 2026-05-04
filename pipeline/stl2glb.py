"""
STL → glTF (.glb) Konvertierung via trimesh

Aufruf:
  python3 stl2glb.py <input.stl> <output.glb> [--scale 0.001]

Voraussetzung:
  pip install trimesh   (im venv: ~/Developer/tools-venv/)

Hinweis zur Skalierung:
  STEP-Dateien sind typisch in Millimeter.
  Three.js-Welt arbeitet meist in Metern.
  Scale 0.001 wandelt mm → m für korrekte Darstellung.
"""

import sys
import os

try:
    import trimesh
except ImportError:
    print("[stl2glb] trimesh fehlt. Install: pip install trimesh", file=sys.stderr)
    sys.exit(1)


def stl_to_glb(stl_path: str, glb_path: str, scale: float = 1.0) -> dict:
    if not os.path.exists(stl_path):
        raise FileNotFoundError(f"STL-Datei nicht gefunden: {stl_path}")

    mesh = trimesh.load(stl_path, force="mesh")

    if scale != 1.0:
        mesh.apply_scale(scale)

    # Optional: Centering für Three.js-friendly origin
    # mesh.apply_translation(-mesh.centroid)

    # Repair: doppelte Vertices entfernen, Normals neu berechnen
    mesh.merge_vertices()
    mesh.fix_normals()

    os.makedirs(os.path.dirname(glb_path) or ".", exist_ok=True)
    mesh.export(glb_path)

    return {
        "input_stl": stl_path,
        "output_glb": glb_path,
        "scale_applied": scale,
        "vertex_count": len(mesh.vertices),
        "face_count": len(mesh.faces),
        "watertight": bool(mesh.is_watertight),
        "bbox_size": mesh.bounding_box.extents.tolist(),
        "file_size_kb": round(os.path.getsize(glb_path) / 1024, 1),
    }


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: stl2glb.py <input.stl> <output.glb> [--scale FACTOR]")
        sys.exit(1)

    stl_path = sys.argv[1]
    glb_path = sys.argv[2]
    scale = 1.0
    if "--scale" in sys.argv:
        idx = sys.argv.index("--scale")
        scale = float(sys.argv[idx + 1])

    print(f"[stl2glb] Konvertiere: {stl_path} → {glb_path}")
    print(f"[stl2glb] Skalierung: {scale}")

    try:
        result = stl_to_glb(stl_path, glb_path, scale)
        print(f"[stl2glb] ✓ glTF geschrieben")
        print(f"[stl2glb] Vertices: {result['vertex_count']}")
        print(f"[stl2glb] Faces: {result['face_count']}")
        print(f"[stl2glb] Watertight: {result['watertight']}")
        print(f"[stl2glb] BBox: {[round(x, 3) for x in result['bbox_size']]}")
        print(f"[stl2glb] Größe: {result['file_size_kb']} KB")
    except Exception as e:
        print(f"[stl2glb] ✗ FEHLER: {e}", file=sys.stderr)
        sys.exit(2)
