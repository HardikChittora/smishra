# Material Dynamics Laboratory

A local, responsive academic website based on https://www.sunitamishra.com/. All six pages retain the laboratory's research, people, projects, publications and professional activities. Images and fonts are local; scholarly links and YouTube embeds retain their original destinations.

Run `npm run dev` and open http://127.0.0.1:4173. The dev command builds the pages before starting the server. After editing files while the server is running, run `npm run build` and refresh the browser.

Preserved content is in `src/content.json`. Page templates are in `scripts/render.mjs`, styling is in `src/replica.css`, and interactions are in `src/app.js`. `npm run build` generates `src/pages` and copies the website to `dist` without external dependencies. Edit the templates or content rather than generated page files.

The design restores the first professional styling version: a restrained navy palette, Arial headings and body typography and responsive layouts. All pages use the original laboratory photograph as a visible background, with a light paper surface behind long text to preserve readability. Research figures stay in one row, scale to fit on desktop, and scroll horizontally on smaller screens. They also open in a detail viewer. The basaltic-rock video plays muted on a loop without player controls, and long pages provide section navigation.

Work is local only. Do not publish or update the hosted copy unless explicitly requested.

The original laboratory copyright notice and attribution are preserved. Source content was captured on 12 October 2026. Keep all visible content faithful to the captured original website. Do not add taglines, descriptions, captions or editorial labels. Videos remain subject to their providers' availability and embedding permissions.

The footer visit counter tracks page loads in the current browser using local storage. It is not a shared total across visitors.

The digit boxes and Visits label match the original POWR Hit Counter appearance. The local preview uses its own browser count. To preserve the existing website total when integrating the design into Wix, retain the existing POWR Hit Counter app (instance 26267531) and its saved data. Do not replace it with this browser-local preview counter.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`, which builds and deploys the `main` branch. The workflow uses `/smishra/` for asset and navigation paths; local builds continue to use `/`.

1. Open https://github.com/HardikChittora/smishra/settings/pages.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the repository's **Actions** tab, select **Deploy website to GitHub Pages**, and click **Run workflow** on `main`.
4. Wait for the deployment to finish. The website URL is https://hardikchittora.github.io/smishra/.

Future pushes to `main` trigger the workflow automatically. No dependency installation is required; the build uses Node.js built-in modules.
