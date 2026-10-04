'use client';

import { useEffect, useRef } from 'react';
import { Ribbon, type RibbonSpec } from './Aurora';

// Ba nhóm màu chồng lên nhau; cuộn trang chỉ đổi opacity từng nhóm:
// đầu trang thiên cyan, giữa trang thiên tím, cuối trang thiên hồng.
const tints: { name: string; ribbons: RibbonSpec[] }[] = [
  {
    name: 'cyan',
    ribbons: [
      { from: '#67E8F9', to: '#6EE7B7', opacity: 0.55, variant: 'a', left: '-12%', top: '4%', width: '85%', height: '48%', rotate: -12, speed: 0.5, depth: 1 },
      { from: '#93C5FD', to: '#67E8F9', opacity: 0.5, variant: 'c', left: '32%', top: '48%', width: '80%', height: '46%', rotate: 8, speed: -0.35, depth: 0.6 },
    ],
  },
  {
    name: 'violet',
    ribbons: [
      { from: '#A78BFA', to: '#93C5FD', opacity: 0.5, variant: 'b', left: '22%', top: '-2%', width: '88%', height: '52%', rotate: 10, speed: -0.45, depth: 0.8 },
      { from: '#A78BFA', to: '#67E8F9', opacity: 0.42, variant: 'a', left: '-16%', top: '46%', width: '74%', height: '44%', rotate: -6, speed: 0.3, depth: 0.5 },
    ],
  },
  {
    name: 'pink',
    ribbons: [
      { from: '#F9A8D4', to: '#A78BFA', opacity: 0.5, variant: 'c', left: '-6%', top: '28%', width: '84%', height: '46%', rotate: -10, speed: 0.4, depth: 0.9 },
      { from: '#F9A8D4', to: '#93C5FD', opacity: 0.42, variant: 'b', left: '40%', top: '0%', width: '68%', height: '42%', rotate: 14, speed: -0.3, depth: 0.6 },
    ],
  },
];

const POINTER_REACH = 30; // px
const DEFAULT_INTENSITY = 0.4;

/** Lớp cực quang cố định sau toàn trang; đậm nhạt theo `data-aurora` của section đang xem. */
export default function AuroraBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const groups = [...root.querySelectorAll<HTMLElement>('[data-tint]')];
    // cả các dải của lớp nền lẫn dải chính trong hero (AuroraRibbon)
    const drifts = [...document.querySelectorAll<HTMLElement>('[data-drift]')].map((el) => ({
      el,
      rotate: Number(el.dataset.rotate),
      speed: Number(el.dataset.speed),
      depth: Number(el.dataset.depth),
      scroll: Number(el.dataset.scroll ?? 0),
    }));
    const fades = [...document.querySelectorAll<HTMLElement>('[data-fade-scroll]')];
    const sections = [...document.querySelectorAll<HTMLElement>('[data-aurora]')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cur = { p: 0, intensity: 1, px: 0, py: 0, sy: 0 };
    const target = { ...cur };
    let raf = 0;

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      target.sy = Math.min(window.scrollY, window.innerHeight * 1.2);
      const middle = window.innerHeight / 2;
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= middle && rect.bottom >= middle;
      });
      target.intensity = active ? Number(active.dataset.aurora) : DEFAULT_INTENSITY;
    };

    const apply = () => {
      const { p, intensity, px, py, sy } = cur;
      root.style.opacity = intensity.toFixed(3);
      const weights = [Math.max(0, 1 - 2 * p), 1 - Math.abs(2 * p - 1), Math.max(0, 2 * p - 1)];
      groups.forEach((group, i) => {
        group.style.opacity = (0.2 + 0.8 * weights[i]).toFixed(3);
      });
      const travel = window.innerHeight * 0.5;
      for (const drift of drifts) {
        const x = px * drift.depth * POINTER_REACH;
        const y = py * drift.depth * POINTER_REACH + (p - 0.5) * drift.speed * travel + sy * drift.scroll;
        const tilt = drift.rotate + px * drift.depth * 4;
        drift.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      }
      // lớp màu thứ hai của dải chính hiện dần khi cuộn (đổi hue)
      const fade = Math.min(1, sy / (window.innerHeight * 0.6)).toFixed(3);
      for (const el of fades) {
        el.style.opacity = fade;
        el.style.visibility = Number(fade) > 0.01 ? 'visible' : 'hidden';
      }
    };

    const frame = () => {
      let moving = false;
      for (const key of ['p', 'intensity', 'px', 'py', 'sy'] as const) {
        const delta = target[key] - cur[key];
        if (Math.abs(delta) > (key === 'sy' ? 0.3 : 0.0005)) {
          cur[key] += delta * 0.08;
          moving = true;
        } else {
          cur[key] = target[key];
        }
      }
      apply();
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    readScroll();
    Object.assign(cur, target);
    apply();
    if (reduced) return; // giữ một khung tĩnh, không bám theo cuộn hay chuột

    const onScroll = () => {
      readScroll();
      kick();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.px = (e.clientX / window.innerWidth - 0.5) * 2;
      target.py = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {tints.map((tint, i) => (
        <div key={tint.name} data-tint={tint.name} className="aurora-tint" style={{ opacity: i === 0 ? 1 : 0.2 }}>
          {tint.ribbons.map((spec) => (
            <Ribbon key={spec.left + spec.top} spec={spec} />
          ))}
        </div>
      ))}
    </div>
  );
}
