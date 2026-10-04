'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';

const MAX_TILT = 4; // độ

/** Card có vệt sáng chạy theo con trỏ và nghiêng 3D nhẹ. CSS tự tắt trên thiết bị touch. */
export default function TiltCard({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x.toFixed(0)}px`);
    el.style.setProperty('--my', `${y.toFixed(0)}px`);
    el.style.setProperty('--ry', `${((x / rect.width - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-(y / rect.height - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
  };

  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <span aria-hidden="true" className="tilt-spot" />
      {children}
    </div>
  );
}
