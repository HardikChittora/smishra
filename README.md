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
- `src/assets/`: images, video and bundled fonts.
- `src/assets-manifest.json`: original asset URLs.
- `src/styles.css`: website styling.
- `src/app.js`: navigation, slideshow, image viewer and local visit counter.
- `scripts/render.mjs`: page templates.
- `scripts/build.mjs`: generates `src/pages/` and `dist/`.
- `scripts/serve.mjs`: local development server.
- `vercel.json`: build command and output directory for Vercel.

Generated folders are excluded from Git. Edit the source content and templates rather than generated HTML.

## Build

Run `npm run build` to generate the complete static website in `dist/`. Use `dist` as the output directory when deploying to a static hosting service.

Vercel reads these settings from `vercel.json` when the repository is imported. Deploy the latest `main` commit with the project root set to the repository root.

## Visit counter

The footer's local counter records page loads in each browser separately. Its appearance follows the original POWR Hit Counter.

When integrating the design into the existing Wix website, retain the existing POWR Hit Counter app and its saved data to preserve the original total. The local counter does not import that history.
