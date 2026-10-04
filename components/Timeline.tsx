import { GraduationCap } from 'lucide-react';
import type { TimelineItem } from '@/data/experience';

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-[9px] top-6 w-0.5 rounded-full bg-gradient-to-b from-[#67E8F9] via-[#A78BFA] to-[#F9A8D4] sm:left-[17px]"
      />
      <ol className="space-y-5 pl-8 sm:pl-12">
        {items.map((item) => (
          <li key={item.period + item.title} className="relative">
            <span
              aria-hidden="true"
              className="timeline-dot absolute -left-7 top-7 h-3 w-3 rounded-full sm:-left-9"
            />
            <div className="card card-hover p-5 sm:p-6">
              <p data-period="" className="font-mono text-sm text-sub">
                {item.period}
              </p>
              <h3 className="mt-1 flex items-center gap-2 text-xl font-semibold sm:text-2xl">
                {item.kind === 'education' && (
                  <GraduationCap aria-hidden="true" size={22} className="shrink-0 text-accent-to" />
                )}
                {item.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-full border border-black/5 bg-page px-3 py-1.5 text-sm text-sub"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
