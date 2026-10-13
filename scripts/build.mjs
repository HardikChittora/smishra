import {cp, mkdir, readdir, readFile, writeFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import './render.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(root, process.env.SITE_OUTPUT_DIR || 'dist');
const basePath = ('/' + (process.env.SITE_BASE_PATH || '').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');
if (out === path.join(root, 'dist')) await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
await cp(path.join(root, 'src/pages'), out, {recursive:true});
await cp(path.join(root, 'src/assets'), path.join(out, 'assets'), {recursive:true});
for (const name of ['app.js','styles.css']) await cp(path.join(root,'src',name),path.join(out,name));
if (basePath !== '/') {
  async function prefixPages(dir) {
    for (const entry of await readdir(dir, {withFileTypes:true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'assets') await prefixPages(file);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const html = await readFile(file, 'utf8');
        await writeFile(file, html.replace(/\b(href|src)=(["'])\/(?!\/)/g, '$1=$2' + basePath));
      }
    }
  }
  await prefixPages(out);
  const cssPath = path.join(out, 'styles.css');
  const css = await readFile(cssPath, 'utf8');
  await writeFile(cssPath, css.replace(/url\((['"]?)\/(?!\/)/g, 'url($1' + basePath));
}
await writeFile(path.join(out, '.nojekyll'), '');
console.log('Built six standalone pages in dist/.');
