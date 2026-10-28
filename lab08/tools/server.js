// Хэмжилтэд зориулсан жижиг сервер: gzip, Range (видео) дэмжинэ.
// Контейнерээс интернет рүү гарах боломжгүй тул гадаад 3 нөөцийг локал хувилбараар сольж өгнө
// (Bootstrap CDN, Google Fonts, OpenStreetMap iframe). Хоёр хуудсанд адил хэрэглэгдэнэ.
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.mp4':'video/mp4','.webm':'video/webm','.vtt':'text/vtt'};
const rewrites = [
  ['https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', '/vendor/bootstrap.min.css'],
  ['https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', '/vendor/bootstrap.bundle.min.js'],
  ['https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&amp;display=swap', '/vendor/empty.css'],
  [/src="https:\/\/www\.openstreetmap\.org[^"]*"/, 'src="about:blank"'],
];
const vendor = {
  '/vendor/bootstrap.min.css': 'node_modules/bootstrap/dist/css/bootstrap.min.css',
  '/vendor/bootstrap.bundle.min.js': 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  '/vendor/empty.css': 'tools/empty.css',
};
http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = vendor[url] ? path.join(root, vendor[url]) : path.join(root, url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  const ext = path.extname(file);
  let body = fs.readFileSync(file);
  const h = {'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'max-age=3600', 'Accept-Ranges': 'bytes'};
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const start = range[1] ? +range[1] : 0, end = range[2] ? +range[2] : body.length - 1;
    h['Content-Range'] = `bytes ${start}-${end}/${body.length}`; h['Content-Length'] = end - start + 1;
    res.writeHead(206, h); return res.end(body.subarray(start, end + 1));
  }
  if (ext === '.html') { let t = body.toString(); for (const [k, v] of rewrites) t = typeof k === 'string' ? t.split(k).join(v) : t.replace(k, v); body = Buffer.from(t); }
  if (['.html', '.css', '.js'].includes(ext)) { h['Content-Encoding'] = 'gzip'; body = zlib.gzipSync(body, {level: 6}); }
  h['Content-Length'] = body.length;
  res.writeHead(200, h); res.end(body);
}).listen(8099, () => console.log('listening 8099'));
