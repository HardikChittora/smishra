import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4','.svg':'image/svg+xml','.avif':'image/avif'};
http.createServer(async (req,res) => {
  try {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    const bytes = await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
    res.end(bytes);
  } catch {res.writeHead(404);res.end('Page not found');}
}).listen(4173,'127.0.0.1',() => console.log('Local: http://127.0.0.1:4173'));
