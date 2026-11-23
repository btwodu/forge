# Forge Strength

A 4-week strength plan for the phone. One tap logs a set and starts the rest timer.

Everything the app needs is in `index.html`. The other files are optional extras:

- `sw.js` lets the app open with no signal after the first visit.
- `manifest.webmanifest` and the `icon-*.png` files give it a proper Home Screen icon.

## Hosting on GitHub Pages

1. Put these files in the root of a public repository.
2. Repository Settings → Pages → Build and deployment → Deploy from a branch → `main`, `/ (root)` → Save.
3. After a minute the app is live at `https://<user>.github.io/<repo>/`.

## Using it

Open the link on the phone, add it to the Home Screen, then open it from the icon and set a baseline there.
Each person's baseline and log stay on their own phone. Nothing is sent anywhere.

To change the app, edit `index.html` and bump `CACHE` in `sw.js` so phones pick up the new icons and manifest.
