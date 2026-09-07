#!/usr/bin/env bash
#
# Publica los repositorios del portfolio en GitHub y enlaza el código desde
# las fichas de los proyectos.
#
# Requisito previo: haber ejecutado `gh auth login` una vez.
#
# Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

set -euo pipefail

GH="/c/Program Files/GitHub CLI/gh.exe"
PORTFOLIO="/c/dev/portfolio"

# Repositorios a publicar: "ruta local|nombre en GitHub|descripción"
REPOS=(
  "/c/dev/nervio-vago|nervio-vago|Rutina diaria de estimulación del nervio vago. Flutter, offline."
  "/c/sangria|sangria|Calendario menstrual con control de píldora y estadísticas. React PWA."
  "/c/Users/angel/AndroidStudioProjects/WeightTracker|WeightTracker|Seguimiento de peso y evolución física. Android, Jetpack Compose."
  "/c/Users/angel/AndroidStudioProjects/SaludDiaria|SaludDiaria|Rutina terapéutica para escoliosis y desrealización. Android, Jetpack Compose."
  "$PORTFOLIO|portfolio|Portfolio de proyectos con demos interactivas. React + Vite."
)

USER=$("$GH" api user --jq .login)
echo "Autenticado como: $USER"
echo

for entry in "${REPOS[@]}"; do
  IFS='|' read -r dir name desc <<< "$entry"

  echo "── $name"
  if [ ! -d "$dir/.git" ]; then
    echo "   ERROR: $dir no es un repositorio Git. Se omite."
    continue
  fi

  cd "$dir"

  if "$GH" repo view "$USER/$name" >/dev/null 2>&1; then
    echo "   Ya existe en GitHub; solo se hace push."
    git remote get-url origin >/dev/null 2>&1 || \
      git remote add origin "https://github.com/$USER/$name.git"
    git push -u origin main
  else
    "$GH" repo create "$name" --public --source=. --remote=origin \
      --description "$desc" --push
  fi

  echo "   https://github.com/$USER/$name"
  echo
done

# Enlaza el código desde el portfolio
cd "$PORTFOLIO"
sed -i "s|export const GITHUB_USER = '';|export const GITHUB_USER = '$USER';|" src/data/profile.js

declare -A REPO_DE_SLUG=(
  ["nervio-vago"]="nervio-vago"
  ["sangria"]="sangria"
  ["weighttracker"]="WeightTracker"
  ["salud-diaria"]="SaludDiaria"
)

for slug in "${!REPO_DE_SLUG[@]}"; do
  repo="${REPO_DE_SLUG[$slug]}"
  # Sustituye el `repo: null` que sigue al slug correspondiente
  perl -0pi -e "s{(slug: '$slug',.*?)repo: null}{\$1repo: 'https://github.com/$USER/$repo'}s" src/data/projects.js
done

npm run build >/dev/null
git add -A
git commit -m "Enlazar los repositorios de GitHub desde las fichas

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push

echo
echo "Listo. Portfolio: https://github.com/$USER/portfolio"
