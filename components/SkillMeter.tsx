'use client';

import { levelLabels, type SkillGroup } from '@/data/skills';
import { useInView } from '@/hooks/useInView';
import { TechIcon } from './TechChip';

const STEPS = [1, 2, 3, 4, 5];

export default function SkillMeter({ group }: { group: SkillGroup }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <div ref={ref}>
      <h3 className="text-lg font-semibold">{group.title}</h3>
      <ul className="mt-3">
        {group.skills.map((skill) => (
          <li
            key={skill.name}
            className="flex items-center gap-2 border-t border-hairline py-2.5 text-[15px]"
          >
            <TechIcon icon={skill.icon} />
            <span className="min-w-0 flex-1 truncate">{skill.name}</span>
            <span aria-hidden="true" className="flex gap-[3px]">
              {STEPS.map((step) => (
                <span key={step} className="h-2 w-3 overflow-hidden rounded-[3px] bg-black/[0.07]">
                  {step <= skill.level && (
                    <span
                      className="bg-accent block h-full w-full origin-left transition-transform duration-500 ease-out"
                      style={{
                        transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                        transitionDelay: `${step * 90}ms`,
                      }}
                    />
                  )}
                </span>
              ))}
            </span>
            <span className="w-[4.5rem] shrink-0 text-right text-xs text-sub">
              {levelLabels[skill.level - 1]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
