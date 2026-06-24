#!/bin/bash
# Copia i file di politimon-game nel repo politimon e fa il push
# Usa: bash deploy-to-politimon.sh /path/to/politimon

DEST=${1:-"../politimon"}

if [ ! -d "$DEST/.git" ]; then
    echo "Errore: $DEST non è un repo git. Clona prima politimon:"
    echo "  git clone https://github.com/fabriziomartini/politimon.git $DEST"
    exit 1
fi

cp index.html "$DEST/"
cp -r css "$DEST/"
cp -r js "$DEST/"
cp README.md "$DEST/"
touch "$DEST/.nojekyll"

cd "$DEST"
git add .
git commit -m "feat: primo prototipo giocabile v0.1"
git push origin main

echo ""
echo "✅ Fatto! Attiva GitHub Pages su github.com/fabriziomartini/politimon"
echo "   Settings → Pages → Branch: main → / (root) → Save"
