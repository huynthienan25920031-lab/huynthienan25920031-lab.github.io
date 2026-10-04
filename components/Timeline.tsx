import { GraduationCap } from 'lucide-react';
import type { TimelineItem } from '@/data/experience';

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-2 border-l border-black/10">
      {items.map((item) => (
        <li key={item.period + item.title} className="relative pb-10 pl-7 last:pb-0 sm:pl-10">
          {item.kind === 'education' ? (
            <span
              aria-hidden="true"
              className="absolute -left-3 top-0 grid h-6 w-6 place-items-center rounded-full border border-hairline bg-white text-sub"
            >
              <GraduationCap size={13} />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="bg-accent absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ring-4 ring-page"
            />
          )}
          <p className="font-mono text-xs text-sub">{item.period}</p>
          <h3 className="font-display mt-1 text-xl font-semibold sm:text-2xl">{item.title}</h3>
          <ul className="mt-3 max-w-2xl space-y-1.5 text-sub">
            {item.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
