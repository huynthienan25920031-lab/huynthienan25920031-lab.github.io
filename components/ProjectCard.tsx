import { TrendingUp } from 'lucide-react';
import type { Project } from '@/data/projects';
import ProjectFrame from './ProjectFrame';
import TiltCard from './TiltCard';

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

type Props = { project: Project; hasImage: boolean; index: number };

export default function ProjectCard({ project, hasImage, index }: Props) {
  const { title, description, features, stack, result, size } = project;
  const frame = { project, hasImage, index };

  if (size === 'featured') {
    return (
      <div className="md:col-span-2 lg:col-span-4 lg:row-span-2">
        <TiltCard className="card-feature card-glow h-full">
          <article className="grid h-full gap-8 p-6 sm:p-9 md:grid-cols-[4fr_5fr] md:items-center">
            <div>
              <p className="text-sm text-sub">Sản phẩm chủ lực</p>
              <h3 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h3>
              <p className="mt-4 text-lg text-sub">{description}</p>
              {features && (
                <ul className="mt-6 space-y-2.5">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 shrink-0 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {stack && (
                <div className="mt-7">
                  <Stack items={stack} />
                </div>
              )}
            </div>
            <ProjectFrame {...frame} sizes="(min-width: 1024px) 420px, 90vw" className="shadow-card" />
          </article>
        </TiltCard>
      </div>
    );
  }

  if (size === 'small') {
    return (
      <div className="md:max-lg:last:col-span-2 lg:col-span-3">
        <TiltCard className="card h-full">
          <article className="flex h-full items-center gap-5 p-5">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-sub">{description}</p>
            </div>
            <ProjectFrame {...frame} compact aspect="aspect-[4/3]" sizes="128px" className="w-28 shrink-0 sm:w-32" />
          </article>
        </TiltCard>
      </div>
    );
  }

  const tall = size === 'tall';

  return (
    <div className={tall ? 'md:row-span-2 lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'}>
      <TiltCard className="card h-full">
        <article className="flex h-full flex-col p-5 sm:p-6">
          <ProjectFrame
            {...frame}
            aspect={tall ? 'aspect-[4/3]' : 'aspect-[16/9]'}
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw"
          />
          <h3 className={`mt-5 font-semibold ${tall ? 'text-2xl' : 'text-xl'}`}>{title}</h3>
          <p className="mt-2 text-sub">{description}</p>
          {(stack || result) && (
            <div className="mt-auto space-y-3 pt-5">
              {stack && <Stack items={stack} />}
              {result && <ResultBadge text={result} />}
            </div>
          )}
        </article>
      </TiltCard>
    </div>
  );
}
