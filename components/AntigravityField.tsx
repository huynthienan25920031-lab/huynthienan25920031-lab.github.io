'use client';

import { useEffect, useRef } from 'react';

const IDLE_AFTER_MS = 1500;
const MAX_DPR = 1.5;
const MAX_BACKGROUND = 640; // chấm nền
const HUES = 12;
const ALPHAS = [0.1, 0.2, 0.35, 0.6, 0.8, 1];
const LEVELS = ALPHAS.length;
const SIZES = [1, 1.5, 2.1]; // bán kính chấm (px), gom 3 cỡ để vẽ theo lô
const SWARM = 320; // số hạt của đám xoáy (mobile: một nửa)
const GROUP = LEVELS * SIZES.length;
const QUIET_ALPHA = 0.1; // độ mờ của hạt khi lọt vào vùng chữ
const QUIET_FADE = 60; // px chuyển tiếp ở mép vùng chữ
const TAU = Math.PI * 2;

// Bảng màu dựng sẵn: 12 bậc hue (cyan 190 → tím → hồng 330) × 6 bậc alpha
const PALETTE: string[] = [];
for (let h = 0; h < HUES; h++) {
  for (const alpha of ALPHAS) {
    PALETTE.push(`hsla(${190 + (140 * h) / (HUES - 1)}, 88%, 58%, ${alpha})`);
  }
}

const sizeLevel = (r: number) => (r < 1.25 ? 0 : r < 1.8 ? 1 : 2);
const alphaLevel = (a: number) => (a < 0.15 ? 0 : a < 0.275 ? 1 : a < 0.475 ? 2 : a < 0.7 ? 3 : a < 0.9 ? 4 : 5);
// hue chạy qua lại cyan ↔ hồng thay vì nhảy vòng
const hueIndex = (v: number) => {
  const f = v - Math.floor(v);
  return Math.round((f < 0.5 ? f * 2 : 2 - f * 2) * (HUES - 1));
};

export default function AntigravityField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let scale = 1;

    // Chấm nền: đứng quanh vị trí gốc, chỉ sáng lên và xoáy nhẹ khi đám hạt đi qua
    const BG = 5; // hx, hy, bán kính, lệch màu/pha, alpha gốc
    let bg = new Float32Array(0);
    // Đám hạt: luôn quay quanh điểm hút bằng lò xo, nên có vệt kéo khi điểm hút chạy nhanh
    const SW = 10; // x, y, vx, vy, bán kính quỹ đạo, góc, tốc độ góc, độ cứng, bán kính, lệch màu
    let swarm = new Float32Array(0);

    // một lô cho mỗi (hue, alpha, cỡ chấm)
    const buckets: number[][] = Array.from({ length: HUES * GROUP }, () => []);

    let raf = 0;
    let onScreen = true;
    let last = 0;
    let lastScrollY = window.scrollY;
    let kick = 0; // -1..1, bật lên khi cuộn nhanh rồi tự co về
    const attractor = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, at: -Infinity };
    const anchor = { x: 0, y: 0, rx: 0, ry: 0, found: false };
    const quiet = { x0: 0, y0: 0, x1: 0, y1: 0, found: false };

    // Không có con trỏ: điểm hút chạy elip quanh khung ảnh chân dung
    const idleTarget = (t: number) => {
      if (anchor.found) {
        return { x: anchor.x + anchor.rx * Math.cos(t * 0.55), y: anchor.y + anchor.ry * Math.sin(t * 0.55) };
      }
      return { x: W * (0.7 + 0.16 * Math.cos(t * 0.55)), y: H * (0.5 + 0.24 * Math.sin(t * 0.55)) };
    };

    const quietFactor = (x: number, y: number) => {
      if (!quiet.found) return 1;
      const dx = Math.max(quiet.x0 - x, 0, x - quiet.x1);
      const dy = Math.max(quiet.y0 - y, 0, y - quiet.y1);
      const d = Math.sqrt(dx * dx + dy * dy);
      return d >= QUIET_FADE ? 1 : d / QUIET_FADE;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.max(0.6, Math.min(1, Math.min(W, H) / 800));
      const narrow = W < 640;

      const gap = Math.max(narrow ? 34 : 30, Math.sqrt((W * H) / MAX_BACKGROUND));
      const cols = Math.floor(W / gap);
      const rows = Math.floor(H / gap);
      bg = new Float32Array(cols * rows * BG);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          bg[i] = (c + 0.5) * (W / cols) + (Math.random() * 2 - 1) * gap * 0.35;
          bg[i + 1] = (r + 0.5) * (H / rows) + (Math.random() * 2 - 1) * gap * 0.35;
          bg[i + 2] = 0.8 + Math.random() * 0.4;
          bg[i + 3] = Math.random();
          bg[i + 4] = 0.15 + Math.random() * 0.1;
          i += BG;
        }
      }

      const measure = (selector: string) => {
        const el = host.querySelector<HTMLElement>(selector);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x0: r.left - rect.left, y0: r.top - rect.top, x1: r.right - rect.left, y1: r.bottom - rect.top };
      };
      const frame = measure('[data-orbit-center]');
      if (frame) {
        anchor.x = (frame.x0 + frame.x1) / 2;
        anchor.y = (frame.y0 + frame.y1) / 2;
        anchor.rx = (frame.x1 - frame.x0) / 2 + 44 * scale;
        anchor.ry = (frame.y1 - frame.y0) / 2 + 44 * scale;
        anchor.found = true;
      }
      const text = measure('[data-particle-quiet]');
      if (text) {
        Object.assign(quiet, { x0: text.x0 - 16, y0: text.y0 - 16, x1: text.x1 + 16, y1: text.y1 + 16, found: true });
      }

      Object.assign(attractor, idleTarget(0));
      swarm = new Float32Array((narrow ? SWARM / 2 : SWARM) * SW);
      for (let j = 0; j < swarm.length; j += SW) {
        const orbit = (18 + 128 * Math.sqrt(Math.random())) * scale;
        const theta = Math.random() * TAU;
        swarm[j] = attractor.x + Math.cos(theta) * orbit;
        swarm[j + 1] = attractor.y + Math.sin(theta) * orbit * 0.8;
        swarm[j + 4] = orbit;
        swarm[j + 5] = theta;
        swarm[j + 6] = 0.5 + Math.random() * 1.1;
        swarm[j + 7] = 0.02 + Math.random() * 0.05;
        swarm[j + 8] = 1.1 + Math.random() * 1.1;
        swarm[j + 9] = Math.random();
      }
    };

    const put = (x: number, y: number, r: number, alpha: number, hue: number) => {
      const q = quietFactor(x, y);
      const a = q >= 1 ? alpha : QUIET_ALPHA + (alpha - QUIET_ALPHA) * q;
      buckets[hueIndex(hue) * GROUP + alphaLevel(a) * SIZES.length + sizeLevel(r)].push(x, y);
    };

    const draw = (t: number, k: number, snap: boolean) => {
      ctx.clearRect(0, 0, W, H);
      const ax = attractor.x;
      const ay = attractor.y;
      const sigma = 120 * scale;
      const reach2 = sigma * sigma * 10;
      const inv = 1 / (2 * sigma * sigma);

      for (let i = 0; i < bg.length; i += BG) {
        const phase = bg[i + 3] * TAU;
        let x = bg[i] + 3 * Math.sin(t * 0.6 + phase);
        let y = bg[i + 1] + 3 * Math.cos(t * 0.5 + phase * 1.3);
        const dx = x - ax;
        const dy = y - ay;
        const d2 = dx * dx + dy * dy;
        let w = 0;
        if (d2 < reach2) {
          w = Math.exp(-d2 * inv);
          const d = Math.sqrt(d2) || 1;
          // xoáy theo tiếp tuyến + đẩy nhẹ ra ngoài
          x += ((-dy / d) * 16 + (dx / d) * 6) * w;
          y += ((dx / d) * 16 + (dy / d) * 6) * w;
        }
        put(x, y, bg[i + 2] + w * 0.5, bg[i + 4] + w * 0.6, bg[i] / W / 2 + bg[i + 3] * 0.22 + t * 0.02);
      }

      const breath = (1 + 0.14 * Math.sin(t * 0.9)) * (1 + Math.abs(kick) * 0.8);
      const damping = Math.pow(0.88, k);
      for (let j = 0; j < swarm.length; j += SW) {
        swarm[j + 5] += swarm[j + 6] * (k / 60);
        const theta = swarm[j + 5];
        const orbit = swarm[j + 4] * breath;
        const tx = ax + Math.cos(theta) * orbit;
        const ty = ay + Math.sin(theta) * orbit * 0.8;
        if (snap) {
          swarm[j] = tx;
          swarm[j + 1] = ty;
        } else {
          swarm[j + 2] = (swarm[j + 2] + (tx - swarm[j]) * swarm[j + 7] * k) * damping;
          swarm[j + 3] = (swarm[j + 3] + (ty - swarm[j + 1]) * swarm[j + 7] * k + kick * 1.6 * k) * damping;
          swarm[j] += swarm[j + 2] * k;
          swarm[j + 1] += swarm[j + 3] * k;
        }
        put(swarm[j], swarm[j + 1], swarm[j + 8], 0.6 + swarm[j + 9] * 0.4, swarm[j + 9] * 0.6 + theta / TAU / 3 + t * 0.04);
      }

      // Mỗi lô (hue, alpha, cỡ) là một path, tô một lần. Chấm cỡ nhỏ nhất (đa số, 2px) vẽ bằng
      // ô vuông vì ở cỡ đó nhìn như chấm tròn mà rẻ hơn arc() rất nhiều; chấm lớn mới dùng arc().
      for (let b = 0; b < buckets.length; b++) {
        const dots = buckets[b];
        if (!dots.length) continue;
        const size = b % SIZES.length;
        const r = SIZES[size];
        ctx.fillStyle = PALETTE[((b / GROUP) | 0) * LEVELS + (((b % GROUP) / SIZES.length) | 0)];
        ctx.beginPath();
        if (size === 0) {
          for (let p = 0; p < dots.length; p += 2) ctx.rect(dots[p] - r, dots[p + 1] - r, r * 2, r * 2);
        } else {
          for (let p = 0; p < dots.length; p += 2) {
            ctx.moveTo(dots[p] + r, dots[p + 1]);
            ctx.arc(dots[p], dots[p + 1], r, 0, TAU);
          }
        }
        ctx.fill();
        dots.length = 0;
      }
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const k = Math.min(2, last ? ((now - last) / 1000) * 60 : 1); // 1 = một frame ở 60fps
      last = now;

      const target = now - pointer.at > IDLE_AFTER_MS ? idleTarget(t) : pointer;
      const ease = 1 - Math.pow(0.75, k);
      attractor.x += (target.x - attractor.x) * ease;
      attractor.y += (target.y - attractor.y) * ease;

      const scrolled = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const want = Math.max(-1, Math.min(1, scrolled / 40));
      kick += (want - kick) * (Math.abs(want) > Math.abs(kick) ? 0.3 : 0.06);

      draw(t, k, false);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduced;
      if (shouldRun && !raf) {
        last = 0;
        lastScrollY = window.scrollY;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const track = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      pointer.x = x;
      pointer.y = y;
      pointer.at = performance.now();
    };
    const onPointer = (e: PointerEvent) => track(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) track(touch.clientX, touch.clientY);
    };

    const resizeObserver = new ResizeObserver(() => {
      build();
      if (reduced) draw(0, 1, true);
    });
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(host);
    document.addEventListener('visibilitychange', sync);

    build();
    if (reduced) {
      draw(0, 1, true);
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
      sync();
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
