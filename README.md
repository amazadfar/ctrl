# CTRL

Set your state.

- **State**: what you observe (anxiety, confidence, energy, focus). Named before and after, five levels.
- **Drivers**: what you choose (importance, curiosity, assertiveness, frame…). Up to three per mode.
- **Rules**: if → then. Up to two per mode.

Set modes up at home; engaging one takes two taps. Afterwards, check in: state now, whether choosing it changed what you did, whether it helped.

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
