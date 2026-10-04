import Image from 'next/image';
import Logo from './Logo';

type Props = { src: string; alt: string; hasImage: boolean; badge: string; className?: string };

/** Khung chân dung chữ nhật 4:5: viền gradient mảnh, viền kính trắng mờ, thẻ vai trò nổi ở góc dưới trái. */
export default function HeroPortrait({ src, alt, hasImage, badge, className = '' }: Props) {
  return (
    <div data-particle-mask="" className={`portrait-frame relative aspect-[4/5] ${className}`}>
      <div className="h-full rounded-[inherit] border border-white/70 bg-white/45 p-1 lg:p-2">
        <div className="relative h-full overflow-hidden rounded-[14px] bg-page lg:rounded-[19px]">
          {hasImage ? (
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              priority
              sizes="(min-width: 1600px) 286px, (min-width: 1024px) 240px, (min-width: 640px) 160px, 130px"
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
        </div>
      </div>
      <p className="glass-chip absolute -left-2 bottom-3 flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium text-ink sm:text-xs lg:-left-5 lg:bottom-6 lg:gap-2 lg:px-3.5 lg:py-1.5 lg:text-[13px]">
        <span aria-hidden="true" className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500 lg:h-2 lg:w-2" />
        {badge}
      </p>
    </div>
  );
}
