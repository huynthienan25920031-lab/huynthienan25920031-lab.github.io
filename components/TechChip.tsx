import { Bot, Braces, MessageSquare, Smartphone, Sparkles, type LucideIcon } from 'lucide-react';
import type { Tech, TechIcon as TechIconData } from '@/data/skills';

const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons';

const lucideIcons: Record<Extract<TechIconData, { type: 'lucide' }>['name'], LucideIcon> = {
  sparkles: Sparkles,
  bot: Bot,
  message: MessageSquare,
  braces: Braces,
  smartphone: Smartphone,
};

export function TechIcon({ icon, size = 18 }: { icon: TechIconData; size?: number }) {
  if (icon.type === 'lucide') {
    const Icon = lucideIcons[icon.name];
    return <Icon aria-hidden="true" size={size} strokeWidth={1.75} className="shrink-0 text-accent-to" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${DEVICON_CDN}/${icon.path}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0"
    />
  );
}

export default function TechChip({ tech }: { tech: Tech }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-hairline bg-white px-3.5 py-1.5 text-sm text-sub">
      <TechIcon icon={tech.icon} size={16} />
      {tech.name}
    </span>
  );
}
