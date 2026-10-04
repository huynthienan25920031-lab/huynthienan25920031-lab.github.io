'use client';

import { useEffect, useRef } from 'react';

// Hình logo (cùng các nét với components/Logo.tsx, hệ toạ độ viewBox 32×32)
const VIEW = 32;
const GLYPH_TOP = 1.4;
const GLYPH_HEIGHT = 28; // từ đỉnh chevron tới chân chữ A
// Bề rộng nét ở đây mảnh hơn logo gốc (2.8 / 2.4 / 1.7) để hạt dày lên, đọc rõ thành nét
const LEGS = { d: 'M6.5 28 16 9.5 25.5 28', width: 1.5 };
const CHEVRON = { d: 'M12 6.2 16 2.6 20 6.2', width: 1.3 };
const ORBIT = { cx: 16, cy: 21, rx: 13, ry: 3.6, rotate: (-16 * Math.PI) / 180, width: 0.8 };

const MAX_DPR = 2;
const SAMPLE = 384; // cạnh canvas ẩn dùng để lấy mẫu điểm theo nét
const INTRO = 1.5; // giây: hạt rải rác tụ thành chữ A
const REPEL_RADIUS = 70; // px
const HUES = 16;
const ALPHAS = [0.5, 0.7, 0.9];
const TAU = Math.PI * 2;

// cyan (chân chữ) → tím → hồng (dấu mũ), dọc theo chiều cao
const hueAt = (v: number) => (v < 0.5 ? 190 + (262 - 190) * (v / 0.5) : 262 + (328 - 262) * ((v - 0.5) / 0.5));
const PALETTE: string[] = [];
const SPARK: string[] = [];
for (let h = 0; h < HUES; h++) {
  const hue = hueAt(h / (HUES - 1));
  for (const alpha of ALPHAS) PALETTE.push(`hsla(${hue}, 90%, 56%, ${alpha})`);
  SPARK.push(`hsl(${hue}, 100%, 74%)`);
}

/** Vẽ một nét của logo lên canvas ẩn rồi lấy ngẫu nhiên `count` điểm nằm trong nét (toạ độ viewBox). */
function samplePath(d: string, width: number, count: number): number[] {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SAMPLE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];
  const scale = SAMPLE / VIEW;
  ctx.scale(scale, scale);
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(d));
  const data = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data;
  const inside: number[] = [];
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) inside.push(i >> 2);
  const points: number[] = [];
  for (let n = 0; n < count && inside.length; n++) {
    const pixel = inside[(Math.random() * inside.length) | 0];
    points.push(((pixel % SAMPLE) + Math.random()) / scale, (((pixel / SAMPLE) | 0) + Math.random()) / scale);
  }
  return points;
}

// Mỗi hạt: x, y, vx, vy | đích (viewBox) | điểm rải ban đầu (px) | pha, biên độ, tần số | cỡ | trễ |
// phần (0 chân, 1 quỹ đạo, 2 chevron) | quỹ đạo: góc, tốc độ, lệch bán kính | hue | lấp lánh
const F = 18;
const [X, Y, VX, VY, TX, TY, SX, SY, PHASE, AMP, FREQ, SIZE, DELAY, PART, THETA, SPEED, RAD, HUE] = Array.from(
  { length: F },
  (_, i) => i,
);

/**
 * Chữ A của logo dựng bằng hạt mịn, đặt sau khung chân dung. Canvas chỉ bao vùng chữ A.
 * Hạt tụ lại khi load, dao động nhẹ, quỹ đạo có hạt chạy vòng, chevron nhấp nhô; con trỏ tới
 * gần thì hạt dạt ra rồi tự về chỗ (lò xo có damping).
 */
export default function ParticleLogo({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0;
    let H = 0;
    let unit = 1; // px cho mỗi đơn vị viewBox
    let ox = 0;
    let oy = 0;
    let p = new Float32Array(0);
    let order: number[] = []; // chỉ số hạt, xếp theo nhóm màu để gom lô khi vẽ
    let group: number[] = [];
    let sparks: number[] = [];
    let built = false;

    let raf = 0;
    let onScreen = true;
    let started = 0; // thời điểm bắt đầu tụ hạt (ms)
    let last = 0;
    const pointer = { x: 0, y: 0, active: false };
    const quiet = { x0: 0, y0: 0, x1: 0, y1: 0, found: false };

    const build = (intro: boolean) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Chữ A cao 87.5% canvas (= 1.4 × chiều cao khung ảnh), canh giữa
      unit = (H * 0.875) / GLYPH_HEIGHT;
      ox = (W - VIEW * unit) / 2;
      oy = H * 0.0625 - GLYPH_TOP * unit;

      const text = document.querySelector<HTMLElement>('[data-particle-quiet]');
      if (text) {
        const t = text.getBoundingClientRect();
        Object.assign(quiet, {
          x0: t.left - rect.left - 10,
          y0: t.top - rect.top - 10,
          x1: t.right - rect.left + 10,
          y1: t.bottom - rect.top + 10,
          found: true,
        });
      }

      const total = W < 460 ? 700 : 1800;
      const counts = [Math.round(total * 0.56), Math.round(total * 0.3), Math.round(total * 0.14)];
      const targets = [samplePath(LEGS.d, LEGS.width, counts[0]), [], samplePath(CHEVRON.d, CHEVRON.width, counts[2])];

      const n = counts[0] + counts[1] + counts[2];
      p = new Float32Array(n * F);
      const bucketOf: number[] = [];
      sparks = [];
      let i = 0;
      for (let part = 0; part < 3; part++) {
        for (let c = 0; c < counts[part]; c++, i++) {
          const o = i * F;
          let tx: number;
          let ty: number;
          if (part === 1) {
            p[o + THETA] = Math.random() * TAU;
            p[o + SPEED] = 0.25 + Math.random() * 0.3; // rad/s, cùng chiều
            p[o + RAD] = (Math.random() - 0.5) * ORBIT.width;
            tx = ORBIT.cx;
            ty = ORBIT.cy;
          } else {
            tx = targets[part][c * 2];
            ty = targets[part][c * 2 + 1];
          }
          p[o + TX] = tx;
          p[o + TY] = ty;
          p[o + PART] = part;
          p[o + PHASE] = Math.random() * TAU;
          p[o + AMP] = 1.2 + Math.random() * 1.6; // dao động 2–3px quanh đích
          p[o + FREQ] = 0.5 + Math.random() * 0.9;
          p[o + SIZE] = 0.5 + Math.random() * 0.6; // bán kính 0.5–1.1px
          p[o + DELAY] = Math.random() * 0.3;
          p[o + SX] = Math.random() * W;
          p[o + SY] = Math.random() * H;
          const hue = Math.round(Math.min(1, Math.max(0, 1 - (ty - GLYPH_TOP) / GLYPH_HEIGHT)) * (HUES - 1));
          p[o + HUE] = hue;
          bucketOf.push(hue * ALPHAS.length + ((Math.random() * ALPHAS.length) | 0));
          if (Math.random() < 0.05) sparks.push(i);
          p[o + X] = p[o + SX];
          p[o + Y] = p[o + SY];
        }
      }
      order = bucketOf.map((_, index) => index).sort((a, b) => bucketOf[a] - bucketOf[b]);
      group = order.map((index) => bucketOf[index]);
      built = true;
      if (!intro) started = -1e9; // resize: không diễn lại màn tụ hạt
    };

    const draw = (t: number, k: number, still: boolean) => {
      ctx.clearRect(0, 0, W, H);
      const elapsed = (performance.now() - started) / 1000;
      const float = still ? 0 : Math.sin((t * TAU) / 6) * 6; // cả chữ A trôi lên xuống, chu kỳ 6s
      const bob = still ? 0 : Math.sin(t * 1.4) * 0.28; // chevron nhấp nhô (đơn vị viewBox)
      const damping = Math.pow(0.8, k);
      const cos = Math.cos(ORBIT.rotate);
      const sin = Math.sin(ORBIT.rotate);
      const r2 = REPEL_RADIUS * REPEL_RADIUS;

      for (let o = 0; o < p.length; o += F) {
        let ux = p[o + TX];
        let uy = p[o + TY];
        const part = p[o + PART];
        if (part === 1) {
          if (!still) p[o + THETA] += p[o + SPEED] * (k / 60);
          const ex = (ORBIT.rx + p[o + RAD]) * Math.cos(p[o + THETA]);
          const ey = (ORBIT.ry + p[o + RAD]) * Math.sin(p[o + THETA]);
          ux += ex * cos - ey * sin;
          uy += ex * sin + ey * cos;
        } else if (part === 2) {
          uy += bob;
        }
        let gx = ox + ux * unit;
        let gy = oy + uy * unit + float;
        if (!still) {
          gx += Math.sin(t * p[o + FREQ] + p[o + PHASE]) * p[o + AMP];
          gy += Math.cos(t * p[o + FREQ] * 0.8 + p[o + PHASE] * 1.7) * p[o + AMP];
        }
        if (still) {
          p[o + X] = gx;
          p[o + Y] = gy;
          continue;
        }
        if (elapsed < INTRO + 0.3) {
          const u = Math.min(1, Math.max(0, (elapsed - p[o + DELAY]) / (INTRO - 0.3)));
          const e = 1 - Math.pow(1 - u, 3);
          gx = p[o + SX] + (gx - p[o + SX]) * e;
          gy = p[o + SY] + (gy - p[o + SY]) * e;
        }
        let vx = p[o + VX] + (gx - p[o + X]) * 0.09 * k;
        let vy = p[o + VY] + (gy - p[o + Y]) * 0.09 * k;
        if (pointer.active) {
          const dx = p[o + X] - pointer.x;
          const dy = p[o + Y] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / REPEL_RADIUS) ** 2 * 2.4 * k;
            vx += (dx / d) * push;
            vy += (dy / d) * push;
          }
        }
        vx *= damping;
        vy *= damping;
        p[o + VX] = vx;
        p[o + VY] = vy;
        p[o + X] += vx * k;
        p[o + Y] += vy * k;
      }

      // Hạt đã xếp sẵn theo nhóm màu: chỉ đổi fillStyle khi sang nhóm khác, mỗi hạt một fillRect
      let current = -1;
      for (let n = 0; n < order.length; n++) {
        const o = order[n] * F;
        const x = p[o + X];
        const y = p[o + Y];
        if (quiet.found && x > quiet.x0 && x < quiet.x1 && y > quiet.y0 && y < quiet.y1) continue; // không đè lên chữ
        if (group[n] !== current) {
          current = group[n];
          ctx.fillStyle = PALETTE[current];
        }
        const r = p[o + SIZE];
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      // Vài hạt sáng hơn, lấp lánh chậm
      for (const index of sparks) {
        const o = index * F;
        const x = p[o + X];
        const y = p[o + Y];
        if (quiet.found && x > quiet.x0 && x < quiet.x1 && y > quiet.y0 && y < quiet.y1) continue;
        ctx.globalAlpha = still ? 0.9 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.9 + p[o + PHASE]));
        ctx.fillStyle = SPARK[p[o + HUE]];
        const r = p[o + SIZE] + 0.35;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const k = Math.min(2, last ? ((now - last) / 1000) * 60 : 1); // 1 = một frame ở 60fps
      last = now;
      draw(now / 1000, k, false);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      const shouldRun = built && onScreen && !document.hidden && !reduced;
      if (shouldRun && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x > -REPEL_RADIUS &&
        pointer.y > -REPEL_RADIUS &&
        pointer.x < rect.width + REPEL_RADIUS &&
        pointer.y < rect.height + REPEL_RADIUS;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    let sized = false;
    const resizeObserver = new ResizeObserver(() => {
      if (!sized) {
        sized = true; // lần gọi đầu tiên: đã build ở dưới
        return;
      }
      build(false);
      if (reduced) draw(0, 1, true);
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    build(true);
    started = performance.now();
    performance.mark('particle-logo-start');
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    if (reduced) {
      draw(0, 1, true); // chữ A tĩnh
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('pointerup', onLeave, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      sync();
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('pointerup', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
