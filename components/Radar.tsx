'use client';

import { useInView } from '@/hooks/useInView';

type Axis = { label: string; value: number };

const W = 400;
const H = 320;
const CX = W / 2;
const CY = 160;
const R = 84;
const RINGS = [0.25, 0.5, 0.75, 1];

export default function Radar({ axes }: { axes: Axis[] }) {
  const { ref, inView } = useInView<SVGSVGElement>(0.35);
  const n = axes.length;

  const point = (i: number, r: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r] as const;
  };
  const ring = (scale: number) =>
    axes.map((_, i) => point(i, R * scale).map((v) => v.toFixed(1)).join(',')).join(' ');
  const shape = axes
    .map((axis, i) => point(i, (R * axis.value) / 100).map((v) => v.toFixed(1)).join(','))
    .join(' ');

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Biểu đồ năng lực: ${axes.map((a) => `${a.label} ${a.value}`).join(', ')}`}
      className="h-auto w-full overflow-visible"
    >
      <defs>
        <linearGradient id="radar-accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {RINGS.map((scale) => (
        <polygon key={scale} points={ring(scale)} fill="none" stroke="rgba(0,0,0,.08)" />
      ))}
      {axes.map((axis, i) => {
        const [x, y] = point(i, R);
        return <line key={axis.label} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(0,0,0,.08)" />;
      })}

      <g
        style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: inView ? 'scale(1)' : 'scale(0)',
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <polygon
          points={shape}
          fill="url(#radar-accent)"
          fillOpacity="0.18"
          stroke="url(#radar-accent)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {axes.map((axis, i) => {
          const [x, y] = point(i, (R * axis.value) / 100);
          return <circle key={axis.label} cx={x} cy={y} r="3.5" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />;
        })}
      </g>

      {axes.map((axis, i) => {
        const [x, rawY] = point(i, R + 18);
        const side = Math.abs(x - CX) < 1 ? 'middle' : x > CX ? 'start' : 'end';
        // hai dòng (nhãn + số): đẩy lên ở đỉnh trên, đẩy xuống ở đỉnh dưới
        const y = side === 'middle' ? (rawY < CY ? rawY - 12 : rawY + 8) : rawY - 4;
        return (
          <text key={axis.label} x={x} y={y} textAnchor={side} fontSize="16" fill="#14131A">
            {axis.label}
            <tspan x={x} dy="17" fontSize="13" fill="#4B4A57" style={{ fontFamily: 'var(--font-mono)' }}>
              {axis.value}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
