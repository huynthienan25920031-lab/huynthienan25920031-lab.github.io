import type { Project } from '@/data/projects';
import Aurora from './Aurora';

function Stack({ items }: { items: string[] }) {
  return <p className="font-mono text-xs text-sub">{items.join(' · ')}</p>;
}

function Result({ text }: { text: string }) {
  return <p className="font-mono text-sm font-bold text-result">→ {text}</p>;
}

export default function ProjectCard({ project }: { project: Project }) {
  const { title, description, features, stack, result, size } = project;

  if (size === 'featured') {
    return (
      <div className="relative isolate">
        <Aurora className="absolute -inset-x-4 -inset-y-10 -z-10 h-[calc(100%+5rem)] w-[calc(100%+2rem)] opacity-90" />
        <article className="grid gap-8 rounded-3xl border border-hairline bg-white/80 p-6 sm:p-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="font-mono text-xs text-sub">sản phẩm chủ lực</p>
            <h3 className="font-display mt-3 text-4xl font-bold sm:text-5xl">{title}</h3>
            <p className="mt-4 max-w-md text-lg text-sub">{description}</p>
            {stack && (
              <div className="mt-6">
                <Stack items={stack} />
              </div>
            )}
          </div>
          {features && (
            <ul className="md:justify-self-end">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 border-t border-hairline py-3 first:border-t-0 md:min-w-72"
                >
                  <span aria-hidden="true" className="bg-accent h-1.5 w-1.5 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    );
  }

  const small = size === 'small';

  return (
    <article
      className={`flex flex-col rounded-2xl border border-hairline bg-white ${small ? 'p-5' : 'p-6 sm:p-7'}`}
    >
      <h3 className={`font-display font-semibold ${small ? 'text-lg' : 'text-2xl'}`}>{title}</h3>
      <p className={`mt-2 text-sub ${small ? 'text-sm' : ''}`}>{description}</p>
      {(stack || result) && (
        <div className="mt-auto space-y-3 pt-6">
          {stack && <Stack items={stack} />}
          {result && <Result text={result} />}
        </div>
      )}
    </article>
  );
}
