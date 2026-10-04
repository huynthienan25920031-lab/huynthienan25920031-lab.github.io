import Image from 'next/image';
import Logo from './Logo';

const DASHES = 60;

// Vòng hạt nhỏ quanh ảnh: các vạch ngắn hướng theo bán kính, xoay chậm bằng CSS
const dashes = Array.from({ length: DASHES }, (_, i) => {
  const angle = (i / DASHES) * Math.PI * 2;
  const length = 3 + 5 * (0.5 + 0.5 * Math.sin(i * 1.7));
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x1: (cos * 88).toFixed(2),
    y1: (sin * 88).toFixed(2),
    x2: (cos * (88 + length)).toFixed(2),
    y2: (sin * (88 + length)).toFixed(2),
    color: `hsl(${(205 + 125 * (0.5 + 0.5 * Math.sin(angle))).toFixed(0)}, 85%, 60%)`,
    opacity: (0.35 + 0.6 * (0.5 + 0.5 * Math.sin(i * 0.9))).toFixed(2),
  };
});

type Props = { src: string; alt: string; hasImage: boolean; className?: string };

export default function HeroPortrait({ src, alt, hasImage, className = '' }: Props) {
  return (
    <div data-orbit-center="" className={`relative aspect-square ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="-100 -100 200 200"
        className="orbit-ring absolute -inset-[16%] h-[132%] w-[132%]"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        {dashes.map((dash, i) => (
          <line key={i} x1={dash.x1} y1={dash.y1} x2={dash.x2} y2={dash.y2} stroke={dash.color} opacity={dash.opacity} />
        ))}
      </svg>
      {/* Vòng sáng gradient + viền trắng dày: tách ảnh (nền đỏ) khỏi tone cực quang mà không sửa màu ảnh */}
      <div className="portrait-ring relative h-full w-full rounded-full p-[3px]">
      <div className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-white bg-white md:border-[8px] lg:border-[10px]">
        {hasImage ? (
          <Image src={src} alt={alt} fill unoptimized priority sizes="(min-width: 1024px) 320px, 176px" className="object-cover" />
        ) : (
          <div
            className="grid h-full w-full place-items-center"
            style={{
              background:
                'radial-gradient(90% 70% at 25% 15%, rgba(255,255,255,.9), transparent 60%), linear-gradient(135deg, #CFFAFE, #DDD6FE 55%, #FBCFE8)',
            }}
          >
            <Logo size={96} className="h-[38%] w-[38%]" />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
