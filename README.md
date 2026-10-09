# CTRL

Set your state.

The first screen is the **desk**: an iOS-style volume bar for every driver (importance, curiosity, assertiveness, frame…). Slide them freely. Tap a driver's name to see its five levels in your words and note why it's set where it is.

**Modes** are optional presets underneath. A mode sets up to three drivers, adds up to two if → then rules, and runs on a timer. Engaging one recalls its levels onto the desk; checking in afterwards puts the desk back. At check-in you read your **state** (anxiety, confidence, energy, focus) on gauges, say whether choosing the mode changed what you did and whether it helped.

Everything is stored on the phone (no backend, no account). Settings → Export backup.

## Develop on your iPhone

```bash
npm install
npm run dev
```

On the iPhone (same Wi-Fi), open `http://<laptop-ip>:5173` in Safari. Edits reload live.
This mode is plain HTTP, so there's no offline support or real install. That needs the deployed HTTPS version.
If the phone can't connect, allow the port: `sudo ufw allow 5173/tcp`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push this folder to a GitHub repo (public, unless you have GitHub Pro).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The app is live at `https://<user>.github.io/<repo>/`.

## Install on iPhone

1. Open the Pages URL in Safari.
2. Share (inside the ••• menu on recent iOS) → **Add to Home Screen** → keep "Open as Web App" on → Add.
3. Launch it from the Home Screen. To confirm it works offline: Airplane Mode on, reopen it.

Updates: push to `main`, then close and reopen the app (sometimes twice). Settings shows the build time, so you can tell when the new version has arrived.

Removing the Home Screen icon deletes your data. Export a backup first.
