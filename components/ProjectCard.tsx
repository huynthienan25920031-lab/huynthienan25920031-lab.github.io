import { TrendingUp } from 'lucide-react';
import type { Project } from '@/data/projects';
import ProjectFrame from './ProjectFrame';

function Stack({ items }: { items: string[] }) {
  return (
    <p data-stack="" className="font-mono text-xs text-sub">
      {items.join(' · ')}
    </p>
  );
}

function ResultBadge({ text }: { text: string }) {
  return (
    <p
      data-result=""
      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/25 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-result"
    >
      <TrendingUp aria-hidden="true" size={15} className="shrink-0" />
      {text}
    </p>
  );
}

/** Chỉ hiện khi ảnh là giao diện minh họa (isMockup) và file ảnh đã có. */
function MockupNote({ show }: { show: boolean }) {
  return show ? (
    <p data-mockup-note="" className="mt-2 text-xs text-sub">
      Giao diện minh họa · dữ liệu mẫu
    </p>
  ) : null;
}

type Props = { project: Project; hasImage: boolean; src: string; index: number };

export default function ProjectCard({ project, hasImage, src, index }: Props) {
  const { title, description, stack, result, size, isMockup } = project;
  const frame = { project, hasImage, src, index };
  const note = <MockupNote show={isMockup && hasImage} />;

  if (size === 'featured') {
    return (
      <div className="md:col-span-2 lg:col-span-4 lg:row-span-2">
        <div className="card-feature card-hover h-full">
          <article className="flex h-full flex-col p-5 sm:p-7">
            <ProjectFrame {...frame} sizes="(min-width: 1024px) 680px, 90vw" className="shadow-card" />
            {note}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
              <div className="max-w-md">
                <p className="text-sm font-medium text-[#6D28D9]">Sản phẩm chủ lực</p>
                <h3 className="mt-1.5 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h3>
                <p className="mt-3 text-lg text-sub">{description}</p>
              </div>
              <div className="space-y-3">
                {stack && <Stack items={stack} />}
                {result && <ResultBadge text={result} />}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (size === 'small') {
    return (
      <div className="lg:col-span-2">
        <div className="card card-hover h-full">
          <article className="flex h-full flex-col justify-center p-5">
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-sub">{description}</p>
              </div>
              <ProjectFrame {...frame} compact sizes="144px" className="w-32 shrink-0 sm:w-36" />
            </div>
            {note}
          </article>
        </div>
      </div>
    );
  }

  const tall = size === 'tall';

  return (
    <div className={tall ? 'md:row-span-2 lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'}>
      <div className="card card-hover h-full">
        <article className="flex h-full flex-col p-5 sm:p-6">
          <ProjectFrame {...frame} sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw" />
          {note}
          <h3 className={`mt-4 font-semibold ${tall ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
          <p className="mt-2 text-sub">{description}</p>
          {(stack || result) && (
            <div className="mt-auto space-y-3 pt-5">
              {stack && <Stack items={stack} />}
              {result && <ResultBadge text={result} />}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
