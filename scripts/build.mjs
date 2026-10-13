import {cp, mkdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import './render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
await cp(path.join(root, 'src/pages'), out, {recursive:true});
await cp(path.join(root, 'src/assets'), path.join(out, 'assets'), {recursive:true});
for (const name of ['app.js','styles.css']) {
  await cp(path.join(root,'src',name),path.join(out,name));
}
console.log('Built six standalone pages in dist/.');
