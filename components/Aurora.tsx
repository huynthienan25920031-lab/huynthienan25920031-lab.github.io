import { useId } from 'react';

const ribbons = [
  {
    name: 'a',
    from: '#67E8F9',
    to: '#A78BFA',
    opacity: 0.5,
    d: 'M-100 190 C 150 90, 380 300, 640 180 S 1080 90, 1300 200 L 1300 290 C 1080 190, 860 370, 640 280 S 150 200, -100 300 Z',
  },
  {
    name: 'b',
    from: '#F9A8D4',
    to: '#93C5FD',
    opacity: 0.42,
    d: 'M-100 330 C 200 420, 420 220, 700 320 S 1100 430, 1300 300 L 1300 390 C 1100 520, 900 330, 700 410 S 200 500, -100 420 Z',
  },
  {
    name: 'c',
    from: '#6EE7B7',
    to: '#67E8F9',
    opacity: 0.38,
    d: 'M-100 450 C 180 360, 460 520, 760 430 S 1120 360, 1300 450 L 1300 520 C 1120 440, 900 580, 760 510 S 180 440, -100 530 Z',
  },
];

export default function Aurora({ className = '' }: { className?: string }) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
    >
      <defs>
        <filter id={`${id}-blur`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        {ribbons.map((ribbon) => (
          <linearGradient key={ribbon.name} id={`${id}-${ribbon.name}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={ribbon.from} stopOpacity="0" />
            <stop offset="0.3" stopColor={ribbon.from} stopOpacity={ribbon.opacity} />
            <stop offset="0.7" stopColor={ribbon.to} stopOpacity={ribbon.opacity} />
            <stop offset="1" stopColor={ribbon.to} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <g filter={`url(#${id}-blur)`}>
        {ribbons.map((ribbon) => (
          <path
            key={ribbon.name}
            d={ribbon.d}
            fill={`url(#${id}-${ribbon.name})`}
            className={`aurora-ribbon aurora-ribbon-${ribbon.name}`}
          />
        ))}
      </g>
    </svg>
  );
}
