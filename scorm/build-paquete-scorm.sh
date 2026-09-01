#!/usr/bin/env bash
# Empaqueta el proyecto en un .zip listo para subir a un LMS SCORM 1.2.
# Uso: bash scorm/build-paquete-scorm.sh
# Genera dist/pronto-heroes-del-instante.zip en la raíz del proyecto.
# Usa el módulo zipfile de Python (portable) en vez del binario `zip`,
# que no está disponible en todos los Git Bash de Windows.

set -euo pipefail
cd "$(dirname "$0")/.."

OUT_DIR="dist"
OUT_ZIP="$OUT_DIR/pronto-heroes-del-instante.zip"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

python - "$OUT_ZIP" <<'PYEOF'
import sys, os, zipfile

out_zip = sys.argv[1]
# imsmanifest.xml va en la RAÍZ del zip (requisito SCORM), no dentro de /scorm.
includes = [
    ("imsmanifest.xml", "scorm/imsmanifest.xml"),
]
dirs = ["index.html", "css", "js", "assets"]

with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    for arcname, src in includes:
        zf.write(src, arcname)
    for entry in dirs:
        if os.path.isfile(entry):
            zf.write(entry, entry)
            continue
        for root, _, files in os.walk(entry):
            for f in files:
                if f == ".gitkeep":
                    continue
                full = os.path.join(root, f)
                zf.write(full, full.replace("\\", "/"))

print("Paquete SCORM generado en:", out_zip)
PYEOF
