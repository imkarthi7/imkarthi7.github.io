#!/bin/sh
# Publish the site to GitHub Pages.
#
#   ./tools/publish.sh "What changed"
#
# Commits everything and pushes. game.html carries its own CSS and JavaScript,
# so there are no separate files to version-stamp.
set -e
cd "$(dirname "$0")/.."

git add -A
git commit -m "${1:-Update site}"
git push
echo "Published. Live in about a minute at https://imkarthi7.github.io"
