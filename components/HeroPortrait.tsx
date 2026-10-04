import Image from 'next/image';
import Logo from './Logo';
import TiltCard from './TiltCard';

type Props = { src: string; alt: string; hasImage: boolean; badge: string; className?: string };

/** Khung chân dung chữ nhật 4:5 dạng glass, nghiêng 3D + vệt sáng theo con trỏ (tắt trên touch). */
export default function HeroPortrait({ src, alt, hasImage, badge, className = '' }: Props) {
  return (
    <div data-orbit-center="" className={`relative ${className}`}>
      <TiltCard max={5} spot={false} className="tilt-open portrait-frame aspect-[4/5]">
        <div className="h-full rounded-[26.5px] border border-white/70 bg-white/45 p-2">
          <div className="relative h-full overflow-hidden rounded-[19px] bg-page">
            {hasImage ? (
              <Image
                src={src}
                alt={alt}
                fill
                unoptimized
                priority
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 256px, 176px"
                className="object-cover object-[50%_30%]"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center"
                style={{
                  background:
                    'radial-gradient(90% 70% at 25% 15%, rgba(255,255,255,.9), transparent 60%), linear-gradient(135deg, #CFFAFE, #DDD6FE 55%, #FBCFE8)',
                }}
              >
                <Logo size={96} className="h-[30%] w-[30%]" />
              </div>
            )}
            <span aria-hidden="true" className="tilt-spot tilt-spot-light" />
          </div>
        </div>
        <p className="tilt-float glass-chip absolute -left-3 bottom-5 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-ink sm:-left-5 sm:bottom-7 sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" className="live-dot h-2 w-2 rounded-full bg-emerald-500" />
          {badge}
        </p>
      </TiltCard>
    </div>
  );
}
