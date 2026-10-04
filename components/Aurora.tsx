import type { CSSProperties } from 'react';

export type RibbonSpec = {
  from: string;
  to: string;
  opacity: number;
  variant: 'a' | 'b' | 'c';
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: number;
  /** Chỉ dùng cho lớp nền toàn trang: tốc độ parallax khi cuộn và độ nhạy với con trỏ. */
  speed?: number;
  depth?: number;
};

const rgba = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Hai quầng radial mềm sẵn ghép thành một dải: không cần filter blur lúc chạy
const blob = (hex: string, opacity: number, at: string) =>
  `radial-gradient(ellipse 34% 50% at ${at} 50%, ${rgba(hex, opacity)} 0%, ${rgba(hex, opacity * 0.45)} 48%, ${rgba(hex, 0)} 100%)`;

export function Ribbon({ spec }: { spec: RibbonSpec }) {
  const style: CSSProperties = {
    left: spec.left,
    top: spec.top,
    width: spec.width,
    height: spec.height,
    transform: `rotate(${spec.rotate}deg)`,
  };
  return (
    <div
      className="aurora-drift"
      style={style}
      data-drift=""
      data-rotate={spec.rotate}
      data-speed={spec.speed ?? 0}
      data-depth={spec.depth ?? 0}
    >
      <div
        className={`aurora-ribbon aurora-ribbon-${spec.variant}`}
        style={{ background: `${blob(spec.from, spec.opacity, '34%')}, ${blob(spec.to, spec.opacity, '66%')}` }}
      />
    </div>
  );
}

const ribbons: RibbonSpec[] = [
  { from: '#67E8F9', to: '#A78BFA', opacity: 0.6, variant: 'a', left: '-10%', top: '-5%', width: '120%', height: '60%', rotate: -6 },
  { from: '#F9A8D4', to: '#93C5FD', opacity: 0.5, variant: 'b', left: '-10%', top: '25%', width: '120%', height: '60%', rotate: 5 },
  { from: '#6EE7B7', to: '#67E8F9', opacity: 0.45, variant: 'c', left: '-10%', top: '50%', width: '120%', height: '55%', rotate: -3 },
];

/** Cực quang cục bộ (khối liên hệ, quầng sáng sau card chủ lực). */
export default function Aurora({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      {ribbons.map((spec) => (
        <Ribbon key={spec.variant} spec={spec} />
      ))}
    </div>
  );
}
