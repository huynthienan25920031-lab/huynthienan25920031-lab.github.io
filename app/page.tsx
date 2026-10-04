import { ArrowDown, Mail, MessageCircle, Phone } from 'lucide-react';
import AntigravityField from '@/components/AntigravityField';
import Aurora from '@/components/Aurora';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import Radar from '@/components/Radar';
import SkillMeter from '@/components/SkillMeter';
import TechChip from '@/components/TechChip';
import Timeline from '@/components/Timeline';
import { timeline } from '@/data/experience';
import { projects } from '@/data/projects';
import { site, stats } from '@/data/site';
import { allTech, radarAxes, skillGroups } from '@/data/skills';

const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8';
const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors';
const buttonDark = `${buttonBase} bg-ink text-white hover:bg-black`;
const buttonOutline = `${buttonBase} border border-black/15 bg-white/70 text-ink backdrop-blur hover:border-black/40`;

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-10 sm:mb-14">
      <p className="font-mono text-sm text-faint">{label}</p>
      <h2 className="font-display mt-2 text-3xl font-semibold sm:text-5xl">{title}</h2>
    </div>
  );
}

export default function Home() {
  const featured = projects.filter((p) => p.size === 'featured');
  const rest = projects.filter((p) => p.size !== 'featured');
  const rise = (step: number) => ({ animationDelay: `${step * 120}ms` });

  return (
    <>
      <Navbar />

      <main id="top">
        <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden">
          <Aurora className="absolute inset-0 -z-20 h-full w-full" />
          <AntigravityField className="absolute inset-0 -z-10 h-full w-full" />
          <div className={`${container} py-24`}>
            <p
              className="rise inline-flex items-center gap-2 rounded-full border border-hairline bg-white/75 px-3 py-1.5 font-mono text-xs text-sub backdrop-blur"
              style={rise(0)}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {site.status}
            </p>
            <h1
              className="rise font-display mt-6 text-[clamp(48px,8vw,96px)] font-bold leading-[1.02]"
              style={rise(1)}
            >
              {site.name}
            </h1>
            <p className="rise mt-5 max-w-xl text-balance text-lg text-sub sm:text-xl" style={rise(2)}>
              {site.tagline}
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={rise(3)}>
              <a href="#san-pham" className={buttonDark}>
                Xem sản phẩm
                <ArrowDown aria-hidden="true" size={16} />
              </a>
              <a href={site.zaloHref} target="_blank" rel="noreferrer" className={buttonOutline}>
                Nhắn Zalo
              </a>
            </div>
          </div>
          <p className="absolute bottom-6 right-5 font-mono text-xs text-faint sm:right-8">
            {'// di chuột để kéo vòng hạt'}
          </p>
        </section>

        <section aria-label="Số liệu nổi bật" className="border-y border-hairline">
          <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px bg-hairline md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse bg-page px-5 py-7 sm:px-8 sm:py-9">
                <dt className="mt-2 font-mono text-xs text-sub sm:text-sm">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold sm:text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="ky-nang" className={`${container} py-20 sm:py-28`}>
          <SectionHead label="~/stack" title="Kỹ năng" />
          <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
            <Radar axes={radarAxes} />
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <SkillMeter key={group.title} group={group} />
              ))}
            </div>
          </div>
          <div className="marquee mt-16">
            <ul className="marquee-track">
              {[...allTech, ...allTech].map((tech, i) => (
                <li key={i} aria-hidden={i >= allTech.length} className="mr-3">
                  <TechChip tech={tech} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="san-pham" className={`${container} py-20 sm:py-28`}>
          <SectionHead label="~/san-pham" title="Sản phẩm" />
          <div className="space-y-5">
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
            <div className="grid gap-5 md:grid-cols-2">
              {rest.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section id="kinh-nghiem" className={`${container} py-20 sm:py-28`}>
          <SectionHead label="~/hanh-trinh" title="Kinh nghiệm" />
          <Timeline items={timeline} />
        </section>

        <section id="lien-he" className={`${container} pb-20 pt-10 sm:pb-28`}>
          <div className="relative isolate overflow-hidden rounded-3xl border border-hairline bg-white px-4 py-16 text-center sm:px-12 sm:py-24">
            <Aurora className="absolute inset-0 -z-10 h-full w-full" />
            <h2 className="font-display mx-auto max-w-3xl text-balance text-3xl font-semibold sm:text-5xl">
              Có quy trình nào đang tốn giờ làm tay?
            </h2>
            <p className="mt-4 text-balance text-lg text-sub">Kể mình nghe trong 30 phút, không cần cam kết.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={site.phoneHref} className={buttonDark}>
                <Phone aria-hidden="true" size={16} />
                {site.phone}
              </a>
              <a href={site.zaloHref} target="_blank" rel="noreferrer" className={buttonOutline}>
                <MessageCircle aria-hidden="true" size={16} />
                Zalo
              </a>
              <a href={`mailto:${site.email}`} className={`${buttonOutline} max-w-full break-all px-4 text-xs sm:px-5 sm:text-sm`}>
                <Mail aria-hidden="true" size={16} className="shrink-0" />
                {site.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <p className={`${container} py-6 font-mono text-xs text-sub`}>
          © {site.year} {site.fullName}
        </p>
      </footer>
    </>
  );
}
