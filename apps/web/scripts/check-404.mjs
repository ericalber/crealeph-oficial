import http from 'node:http';
import { readFile } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://localhost:3003';

const sitemapUrl = new URL('/sitemap.xml', base).toString();

function req(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ status: res.statusCode || 0, url });
      res.resume();
    });
    req.on('error', () => resolve({ status: 0, url }));
  });
}

async function main() {
  const res = await fetch(sitemapUrl);
  const xml = await res.text();
  const paths = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((m) => m[1]);
  const out = [];
  for (const u of paths) {
    // HEAD then GET on non-200
    let r = await req(u);
    if (r.status >= 300) {
      r = await req(u);
    }
    out.push(r);
  }
  const bad = out.filter((o) => o.status >= 400 || o.status === 0);
  console.log('Checked', out.length, 'routes. Failing:', bad.length);
  bad.forEach((b) => console.log(b.status, b.url));
}

main().catch((e) => { console.error(e); process.exit(1); });

