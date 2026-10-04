import { useId } from 'react';

/**
 * Chữ Â phản trọng lực: hai nét chéo không có gạch ngang, thay bằng một vòng
 * quỹ đạo elip nghiêng; dấu mũ là chevron tách rời, bay lên khỏi đỉnh.
 * Các path dưới đây dùng lại ở app/icon.svg và app/og.png/route.tsx.
 */
export default function Logo({
  size = 28,
  animated = false,
  className = '',
}: {
  size?: number;
  /** Tự vẽ bằng stroke-dashoffset khi load trang. */
  animated?: boolean;
  className?: string;
}) {
  const gradient = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`${animated ? 'logo-draw' : ''} ${className}`}
      stroke={`url(#${gradient})`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="5" y1="28" x2="27" y2="3">
          <stop offset="0" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path d="M6.5 28 16 9.5 25.5 28" strokeWidth="2.8" pathLength={1} />
      <ellipse
        className="logo-orbit"
        cx="16"
        cy="21"
        rx="13"
        ry="3.6"
        transform="rotate(-16 16 21)"
        strokeWidth="1.7"
        pathLength={1}
      />
      <g className="logo-chevron">
        <path d="M12 6.2 16 2.6 20 6.2" strokeWidth="2.4" pathLength={1} />
      </g>
    </svg>
  );
}
