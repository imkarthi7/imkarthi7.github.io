#!/bin/sh
# Publish the site to GitHub Pages.
#
#   ./tools/publish.sh "What changed"
#
# Stamps a new version on styles.css, content.js and main.js in index.html
# (e.g. main.js?v=20260927004500), so browsers fetch the new files instead of
# reusing cached copies, then commits everything and pushes.
set -e
cd "$(dirname "$0")/.."

v=$(date +%Y%m%d%H%M%S)
sed -i '' -E "s/(styles\.css|content\.js|main\.js)(\?v=[0-9]+)?\"/\1?v=$v\"/g" index.html

git add -A
git commit -m "${1:-Update site}"
git push
echo "Published version $v. Live in about a minute at https://imkarthi7.github.io"
