'use client';

import { useEffect, useRef } from 'react';

type Dot = { bx: number; by: number; x: number; y: number };

const JITTER = 4;
const BAND_SIGMA = 46;
const IDLE_AFTER_MS = 2500;

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
    let dots: Dot[] = [];
    let raf = 0;
    let visible = true;
    let placed = false;
    const center = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, at: -Infinity };

    // Quỹ đạo Lissajous ở nửa phải hero (màn hẹp thì nhích lên trên, tránh đè chữ)
    const idleTarget = (t: number) =>
      W < 640
        ? { x: W * (0.64 + 0.2 * Math.sin(t * 0.5)), y: H * (0.26 + 0.1 * Math.sin(t * 0.8 + 1)) }
        : { x: W * (0.72 + 0.15 * Math.sin(t * 0.5)), y: H * (0.5 + 0.22 * Math.sin(t * 0.8 + 1)) };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = W < 640 ? 26 : 20;
      dots = [];
      for (let y = gap / 2; y < H; y += gap) {
        for (let x = gap / 2; x < W; x += gap) {
          const bx = x + (Math.random() * 2 - 1) * JITTER;
          const by = y + (Math.random() * 2 - 1) * JITTER;
          dots.push({ bx, by, x: bx, y: by });
        }
      }

      if (!placed && W > 0) {
        Object.assign(center, idleTarget(0));
        placed = true;
      }
    };

    const draw = (t: number, snap: boolean) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.6;

      const R = Math.min(W, H) * 0.26 + Math.sin(t * 1.6) * 10;

      for (const dot of dots) {
        const dx = dot.bx - center.x;
        const dy = dot.by - center.y;
        const d = Math.hypot(dx, dy) || 0.0001;
        const ux = dx / d;
        const uy = dy / d;

        const band = Math.exp(-((d - R) ** 2) / (2 * BAND_SIGMA * BAND_SIGMA));
        const push = (d < R ? (R - d) * 0.42 : 0) + band * 10 * Math.sin(t * 2.4 - d * 0.05);
        const tx = dot.bx + ux * push;
        const ty = dot.by + uy * push;

        if (snap) {
          dot.x = tx;
          dot.y = ty;
        } else {
          dot.x += (tx - dot.x) * 0.14;
          dot.y += (ty - dot.y) * 0.14;
        }

        const half = (1.2 + band * 7) / 2;
        const alpha = 0.07 + band * 0.85;
        // xanh (205) → tím → hồng (330), chạy theo góc và thời gian
        const hue = 205 + 125 * (0.5 + 0.5 * Math.sin(Math.atan2(dy, dx) + t * 0.7));

        ctx.strokeStyle = `hsla(${hue}, ${20 + band * 68}%, ${42 + band * 18}%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(dot.x - ux * half, dot.y - uy * half);
        ctx.lineTo(dot.x + ux * half, dot.y + uy * half);
        ctx.stroke();
      }
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const target = now - pointer.at > IDLE_AFTER_MS ? idleTarget(t) : pointer;
      center.x += (target.x - center.x) * 0.08;
      center.y += (target.y - center.y) * 0.08;
      draw(t, false);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
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
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    intersectionObserver.observe(host);

    build();
    if (reduced) {
      draw(0, true);
    } else {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
