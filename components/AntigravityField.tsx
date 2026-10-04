'use client';

import { useEffect, useRef } from 'react';

const JITTER = 4;
const IDLE_AFTER_MS = 2500;
const MAX_DOTS = 1400;
const MAX_DPR = 1.5;
const HUES = 24;
const LEVELS = 5;
const MIN_BAND = 0.05; // dưới mức này vạch gần như vô hình: bỏ qua, không vẽ

// Bảng màu dựng sẵn: 24 bậc hue (xanh 205 → tím → hồng 330) × 5 bậc đậm nhạt
const PALETTE: string[] = [];
for (let h = 0; h < HUES; h++) {
  for (let l = 0; l < LEVELS; l++) {
    const band = (l + 0.5) / LEVELS;
    const hue = 205 + (125 * h) / (HUES - 1);
    PALETTE.push(`hsla(${hue}, ${20 + band * 68}%, ${42 + band * 18}%, ${0.07 + band * 0.85})`);
  }
}

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
    let count = 0;
    let base = new Float32Array(0); // bx, by
    let pos = new Float32Array(0); // x, y
    const buckets: number[][] = PALETTE.map(() => []);

    let raf = 0;
    let onScreen = true;
    let placed = false;
    let lastScrollY = window.scrollY;
    let kick = 0; // -1..1, bật lên khi cuộn nhanh rồi tự co về
    const center = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, at: -Infinity };
    const anchor = { x: 0, y: 0, found: false };

    // Không có con trỏ: vòng hạt trôi Lissajous quanh ảnh chân dung
    const idleTarget = (t: number) => {
      if (anchor.found) {
        const reach = Math.min(W, H) * 0.035;
        return { x: anchor.x + reach * Math.sin(t * 0.5), y: anchor.y + reach * 0.7 * Math.sin(t * 0.8 + 1) };
      }
      return { x: W * (0.72 + 0.15 * Math.sin(t * 0.5)), y: H * (0.5 + 0.22 * Math.sin(t * 0.8 + 1)) };
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Lưới 24px (30px trên mobile), tự nới theo diện tích để không vượt MAX_DOTS
      const gap = Math.max(W < 640 ? 30 : 24, Math.sqrt((W * H) / MAX_DOTS));
      const cols = Math.floor(W / gap);
      const rows = Math.floor(H / gap);
      count = cols * rows;
      base = new Float32Array(count * 2);
      pos = new Float32Array(count * 2);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          base[i] = (c + 0.5) * (W / cols) + (Math.random() * 2 - 1) * JITTER;
          base[i + 1] = (r + 0.5) * (H / rows) + (Math.random() * 2 - 1) * JITTER;
          i += 2;
        }
      }
      pos.set(base);

      const orbit = host.querySelector<HTMLElement>('[data-orbit-center]');
      if (orbit) {
        const o = orbit.getBoundingClientRect();
        anchor.x = o.left - rect.left + o.width / 2;
        anchor.y = o.top - rect.top + o.height / 2;
        anchor.found = true;
      }

      if (!placed && W > 0) {
        Object.assign(center, idleTarget(0));
        placed = true;
      }
    };

    const draw = (t: number, snap: boolean) => {
      ctx.clearRect(0, 0, W, H);

      const stretch = Math.abs(kick);
      const R = Math.min(W, H) * 0.26 + Math.sin(t * 1.6) * 10 + stretch * 70;
      const sigma = Math.min(46, R * 0.36);
      const reach = sigma * 3.2;
      const inv = 1 / (2 * sigma * sigma);
      const spin = t * 0.7;

      for (let i = 0; i < count * 2; i += 2) {
        const bx = base[i];
        const by = base[i + 1];
        const dx = bx - center.x;
        const dy = by - center.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
        const ux = dx / d;
        const uy = dy / d;
        const off = d - R;

        const band = off > -reach && off < reach ? Math.exp(-(off * off) * inv) : 0;
        const push = (d < R ? (R - d) * 0.42 : 0) + band * 10 * Math.sin(t * 2.4 - d * 0.05);
        const tx = bx + ux * push;
        const ty = by + uy * push;
        if (snap) {
          pos[i] = tx;
          pos[i + 1] = ty;
        } else {
          pos[i] += (tx - pos[i]) * 0.14;
          pos[i + 1] += (ty - pos[i + 1]) * 0.14;
        }
        if (band < MIN_BAND) continue;

        const half = (1.2 + band * 7) / 2;
        const pull = kick * 11 * band; // kéo dài vạch theo hướng cuộn
        const hue = Math.round((0.5 + 0.5 * Math.sin(Math.atan2(dy, dx) + spin)) * (HUES - 1));
        const level = Math.min(LEVELS - 1, Math.floor(band * LEVELS));
        buckets[hue * LEVELS + level].push(
          pos[i] - ux * half,
          pos[i + 1] - uy * half - pull,
          pos[i] + ux * half,
          pos[i + 1] + uy * half + pull,
        );
      }

      // Mỗi màu vẽ chung một path
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6;
      for (let b = 0; b < buckets.length; b++) {
        const segments = buckets[b];
        if (!segments.length) continue;
        ctx.strokeStyle = PALETTE[b];
        ctx.beginPath();
        for (let s = 0; s < segments.length; s += 4) {
          ctx.moveTo(segments[s], segments[s + 1]);
          ctx.lineTo(segments[s + 2], segments[s + 3]);
        }
        ctx.stroke();
        segments.length = 0;
      }
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const target = now - pointer.at > IDLE_AFTER_MS ? idleTarget(t) : pointer;
      center.x += (target.x - center.x) * 0.08;
      center.y += (target.y - center.y) * 0.08;

      const scrolled = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      const want = Math.max(-1, Math.min(1, scrolled / 40));
      kick += (want - kick) * (Math.abs(want) > Math.abs(kick) ? 0.3 : 0.06);

      draw(t, false);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = onScreen && !document.hidden && !reduced;
      if (shouldRun && !raf) {
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
      if (reduced) draw(0, true);
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
      draw(0, true);
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
