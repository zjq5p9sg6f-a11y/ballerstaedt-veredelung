#!/bin/bash
# Batch-Konvertierung: alle STEP-Dateien in samples/ → glTF in output/
#
# Aufruf:  ./batch.sh
#          ./batch.sh /path/to/single-file.step
#
# Pipeline pro Datei:
#   STEP → STL (FreeCAD-Headless via Stdin-Pipe, Tessellation)
#   STL  → GLB (trimesh, web-optimiert mit Skalierung mm→m)
#   meta.json wird daneben gespeichert (Volumen, BBox, Vertex-Count)

set -e

PIPELINE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SAMPLES_DIR="$PIPELINE_DIR/samples"
OUTPUT_DIR="$PIPELINE_DIR/output"

# FreeCAD-CLI auf macOS
FREECAD_CMD="/Applications/FreeCAD.app/Contents/Resources/bin/FreeCADCmd"
if [ ! -x "$FREECAD_CMD" ]; then
  if command -v FreeCADCmd &> /dev/null; then
    FREECAD_CMD="FreeCADCmd"
  else
    echo "✗ FreeCADCmd nicht gefunden. Bitte installieren: brew install --cask freecad"
    exit 1
  fi
fi

# Python-venv für trimesh
PYTHON="${TOOLS_VENV_PY:-$HOME/Developer/tools-venv/bin/python3}"
if [ ! -x "$PYTHON" ]; then
  PYTHON="python3"
fi
if ! "$PYTHON" -c "import trimesh" 2>/dev/null; then
  echo "✗ trimesh fehlt im Python. Install: pip install trimesh"
  echo "  Empfohlen: ~/Developer/tools-venv/ aktivieren"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# FreeCAD-Helper: Skript via Stdin-Pipe ausführen mit Argumenten
# Trick: Single-line exec damit FreeCADCmd-REPL es als ein Statement interpretiert.
# (Mehrzeilen-Pipe würde zeilenweise eingelesen → IndentationError bei Python-Blocks)
freecad_run() {
  local script="$1"; shift
  local args_py
  args_py=$(printf "'%s'," "$@")
  args_py="[${args_py%,}]"

  local cmd="import sys; sys.argv = ['$(basename "$script")'] + $args_py; "
  cmd+="exec(open('$script').read(), {'__name__': '__main__', '__file__': '$script'})"

  echo "$cmd" | "$FREECAD_CMD"
}

# Single-File-Mode oder Batch
if [ -n "$1" ]; then
  files=("$1")
else
  files=("$SAMPLES_DIR"/*.step "$SAMPLES_DIR"/*.STEP "$SAMPLES_DIR"/*.stp)
fi

count=0
fails=0
for step_file in "${files[@]}"; do
  [ ! -f "$step_file" ] && continue

  base=$(basename "$step_file")
  name="${base%.*}"
  stl_path="$OUTPUT_DIR/$name.stl"
  glb_path="$OUTPUT_DIR/$name.glb"

  echo "▶ $base"
  echo "  → $stl_path"

  if ! freecad_run "$PIPELINE_DIR/step2stl.py" "$step_file" "$stl_path" "0.05"; then
    echo "  ✗ STEP→STL fehlgeschlagen"
    fails=$((fails + 1))
    continue
  fi

  echo "  → $glb_path (Scale: mm→m)"
  if ! "$PYTHON" "$PIPELINE_DIR/stl2glb.py" "$stl_path" "$glb_path" --scale 0.001; then
    echo "  ✗ STL→GLB fehlgeschlagen"
    fails=$((fails + 1))
    continue
  fi

  count=$((count + 1))
  echo "  ✓ Fertig"
  echo
done

echo "═══════════════════════════════════════════════════════"
echo "  Fertig: $count Dateien konvertiert, $fails Fehler"
echo "  Output: $OUTPUT_DIR"
echo "═══════════════════════════════════════════════════════"
