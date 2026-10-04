import Image from 'next/image';
import type { Project } from '@/data/projects';

// Cặp màu placeholder, xoay vòng theo thứ tự sản phẩm
const tones = [
  ['#67E8F9', '#A78BFA'],
  ['#A78BFA', '#F9A8D4'],
  ['#6EE7B7', '#93C5FD'],
  ['#F9A8D4', '#93C5FD'],
  ['#93C5FD', '#A78BFA'],
];

type Props = {
  project: Project;
  /** File ảnh đã có trong public/ chưa (kiểm tra lúc build). */
  hasImage: boolean;
  /** Đường dẫn ảnh kèm mã phiên bản (lib/assets.ts). */
  src: string;
  index: number;
  sizes: string;
  className?: string;
  compact?: boolean;
};

/** Khung ảnh sản phẩm: cửa sổ trình duyệt 16:10 hoặc điện thoại 9:19.5. */
export default function ProjectFrame({ project, hasImage, src, index, sizes, className = '', compact = false }: Props) {
  const [from, to] = tones[index % tones.length];
  const phone = project.frame === 'phone';

  const screen = hasImage ? (
    <Image
      src={src}
      alt={`${project.isMockup ? 'Giao diện minh họa' : 'Ảnh màn hình'} ${project.title}`}
      fill
      unoptimized
      loading="lazy"
      sizes={sizes}
      className="object-cover"
      style={{ objectPosition: project.imagePosition ?? 'top' }}
    />
  ) : (
    <div
      className="absolute inset-0 grid place-items-center p-3 text-center"
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, rgba(255,255,255,.75), transparent 60%), linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      <span className={`font-medium text-ink/80 ${compact ? 'text-xs' : phone ? 'text-sm' : 'text-base sm:text-lg'}`}>
        {project.title}
      </span>
    </div>
  );

  if (phone) {
    return (
      <div className={`grid place-items-center rounded-xl bg-white/50 py-5 ${className}`}>
        <div className="w-[46%] max-w-[190px] overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-white">
          <div className="relative aspect-[9/19.5]">{screen}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-black/10 bg-white ${className}`}>
      <div
        aria-hidden="true"
        className={`flex items-center gap-1.5 border-b border-black/5 bg-page px-3 ${compact ? 'h-4' : 'h-7'}`}
      >
        {['#FCA5A5', '#FCD34D', '#86EFAC'].map((dot) => (
          <span key={dot} className={`rounded-full ${compact ? 'h-1 w-1' : 'h-2 w-2'}`} style={{ background: dot }} />
        ))}
      </div>
      <div className="relative aspect-[16/10]">{screen}</div>
    </div>
  );
}
