# Material Dynamics Laboratory

A responsive website based on [sunitamishra.com](https://www.sunitamishra.com/), with six pages covering the laboratory, biography, team, projects, publications and professional activities. The original content, copyright notice and external links are preserved.

## Run locally

Requires Node.js. No external packages are needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173/. After editing files while the server is running, run `npm run build` and refresh the browser.

## Project files

- `src/content.json`: page content.
- `src/assets/`: images, video and the counter font.
- `src/assets-manifest.json`: original asset URLs.
- `src/styles.css`: website styling.
- `src/app.js`: navigation, slideshow, image viewer and local visit counter.
- `scripts/render.mjs`: page templates.
- `scripts/build.mjs`: generates `src/pages/` and `dist/`.
- `scripts/serve.mjs`: local development server.
- `.github/workflows/pages.yml`: GitHub Pages deployment.

Generated folders are excluded from Git. Edit the source content and templates rather than generated HTML.

## GitHub Pages

1. Open [Settings → Pages](https://github.com/HardikChittora/smishra/settings/pages).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab, select **Deploy website to GitHub Pages**, and click **Run workflow** on `main`.
4. After a successful deployment, visit https://hardikchittora.github.io/smishra/.

Future pushes to `main` deploy automatically. The workflow builds with `/smishra/` as the base path; local builds use `/`.

## Visit counter

The footer's local counter records page loads in each browser separately. Its appearance follows the original POWR Hit Counter.

When integrating the design into the existing Wix website, retain the existing POWR Hit Counter app and its saved data to preserve the original total. The local counter does not import that history.
