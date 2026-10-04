// Chụp các giao diện minh họa trong mockups/ thành public/images/<slug>-1.webp (2x).
// Dùng Edge/Chrome headless qua DevTools Protocol, không cần cài thêm gì ngoài sharp (đã có sẵn theo Next).
//   node mockups/capture.mjs            chụp tất cả
//   node mockups/capture.mjs crm-ai hrm chỉ chụp các slug nêu tên
// Đổi trình duyệt: đặt biến môi trường BROWSER_PATH.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const here = import.meta.dirname;
const out = path.join(here, '..', 'public', 'images');

// Khung trình duyệt 16:10, khung điện thoại 9:19.5 (khớp components/ProjectFrame.tsx)
const BROWSER = { width: 960, height: 600 };
const PHONE = { width: 360, height: 780 };
const shots = {
  'crm-ai': BROWSER,
  booking: BROWSER,
  chatbot: PHONE,
  'web-ban-hang': BROWSER,
  'ai-seo': BROWSER,
  hrm: BROWSER,
};

const browser =
  process.env.BROWSER_PATH ??
  [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!browser) throw new Error('Không tìm thấy Edge/Chrome. Đặt BROWSER_PATH trỏ tới file chạy của trình duyệt.');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 9350;
const proc = spawn(browser, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(path.join(tmpdir(), 'mockups-'))}`,
  '--hide-scrollbars',
  'about:blank',
]);

let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(500);
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => (ws.onopen = resolve));
let id = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    pending.set(++id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Page.enable');
const wanted = process.argv.slice(2);
for (const [slug, size] of Object.entries(shots)) {
  if (wanted.length && !wanted.includes(slug)) continue;
  await send('Emulation.setDeviceMetricsOverride', { ...size, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(path.join(here, `${slug}.html`)).href });
  await sleep(600);
  await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
  await sleep(300);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const info = await sharp(Buffer.from(data, 'base64')).webp({ quality: 84 }).toFile(path.join(out, `${slug}-1.webp`));
  console.log(`${slug}-1.webp`, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
}

ws.close();
proc.kill();
process.exit(0);
