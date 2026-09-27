# Karthik OS

Karthik's creative CV for L'Oréal, played as an 8-bit game. Live at **https://imkarthi7.github.io**.

The whole site is one file, `game.html`, with no build step. `index.html` only redirects to it (keeping
any `#room` link, e.g. `/#beauty`).

## Files

| File | What it is |
|---|---|
| `game.html` | The site: loader, desk, three folder rooms, contact page |
| `index.html` | Redirect to `game.html` |
| `assets/img/karthik.webp` | Photo on Folder 01, card 01 |
| `assets/img/karthik-badge.webp` | Small photo on the Contact page badge |
| `assets/img/motto.webp` | Photo on Folder 01, card 05 (My motto) |
| `assets/img/loreal-products.webp` | Photo on the L'Oréal Paris card |
| `assets/brand/loreal-paris-logo.png` | Logo on the L'Oréal Paris card |
| `assets/og-image.png` | Preview image shown when the link is shared (1200 × 630) |
| `assets/Karthik_J_Resume.pdf` | The résumé every CV link points to |
| `assets/resume.pdf` | Identical copy at the résumé's old address, so older links keep working (replace both together) |
| `favicon.png`, `favicon.ico` | Browser tab icon |
| `tools/publish.sh` | Commit and push to GitHub Pages |

`assets/photos/` holds the original photos. It is in `.gitignore` and never published.

## Editing text

Every card's text is in the `FOLDERS` list near the top of the `<script>` in `game.html`. Change only the
text between the quotes. Each card can use `body` (paragraphs), `sections` (sub-headings with text),
`list` (short lines) and `actions` (buttons).

## Previewing

From this folder, run the command below and open http://localhost:8123/game.html (Ctrl+C stops it):

```bash
python3 -m http.server 8123
```

## Publishing

```bash
cd ~/Documents/loreal-cv && ./tools/publish.sh "What changed"
```

GitHub rebuilds the site in about a minute. Visitors may need a hard refresh (Cmd+Shift+R) to see it.

The previous "bottle" version of the site was removed on 27 Sep 2026 and is still in git history.
