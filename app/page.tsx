import { ArrowDown, Mail, MessageCircle, Phone } from 'lucide-react';
import Aurora from '@/components/Aurora';
import AuroraBackdrop from '@/components/AuroraBackdrop';
import AuroraRibbon from '@/components/AuroraRibbon';
import HeroPortrait from '@/components/HeroPortrait';
import Navbar from '@/components/Navbar';
import ParticleLogo from '@/components/ParticleLogo';
import ProjectCard from '@/components/ProjectCard';
import QualityGuard from '@/components/QualityGuard';
import Radar from '@/components/Radar';
import SkillMeter from '@/components/SkillMeter';
import TechChip from '@/components/TechChip';
import Timeline from '@/components/Timeline';
import { timeline } from '@/data/experience';
import { projects } from '@/data/projects';
import { site, stats } from '@/data/site';
import { allTech, radarAxes, skillGroups } from '@/data/skills';
import { publicFileExists, versionedSrc } from '@/lib/assets';

const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8';
const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors';
const buttonDark = `${buttonBase} bg-ink text-white hover:bg-black`;
const buttonOutline = `${buttonBase} border border-black/15 bg-white/80 text-ink hover:border-black/40`;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display mb-10 text-3xl font-semibold sm:mb-14 sm:text-5xl">{children}</h2>;
}

export default function Home() {
  const rise = (step: number) => ({ animationDelay: `${step * 120}ms` });

  return (
    <>
      <QualityGuard />
      <AuroraBackdrop />
      <Navbar />

      <main id="top">
        <section
          id="hero"
          data-aurora="1"
          className="relative isolate flex min-h-[90vh] items-center overflow-hidden"
        >
          <AuroraRibbon />
          <div
            className={`${container} grid items-center gap-8 pb-20 pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:py-24`}
          >
            {/*
              Sân khấu chữ A (--a = chiều cao chữ): chữ A hạt đứng tự do, khung chân dung chồng lên góc
              dưới phải, chỉ che chân phải và đầu phải vòng quỹ đạo (~11% diện tích chữ A).
              Chữ A rộng 0.93a; ảnh rộng pw·a (--pw) đặt tại (0.714a, 0.539a).
            */}
            <div className="relative h-[calc(var(--a)*(0.539+var(--pw)*1.25))] w-[calc(var(--a)*(0.714+var(--pw)))] [--a:260px] [--pw:0.5] sm:[--a:320px] lg:order-2 lg:[--a:420px] lg:[--pw:0.571] min-[1600px]:[--a:500px]">
              <ParticleLogo className="pointer-events-none absolute left-[calc(var(--a)*-0.06)] top-[calc(var(--a)*-0.06)] h-[calc(var(--a)*1.12)] w-[calc(var(--a)*1.05)]" />
              <div
                className="rise absolute left-[calc(var(--a)*0.714)] top-[calc(var(--a)*0.539)] w-[calc(var(--a)*var(--pw))]"
                style={rise(2)}
              >
                <HeroPortrait
                  src={versionedSrc(site.avatar)}
                  alt={`Chân dung ${site.fullName}`}
                  hasImage={publicFileExists(site.avatar)}
                  badge={site.role}
                />
              </div>
            </div>
            <div data-particle-quiet="" className="w-fit max-w-full">
              <p
                className="rise inline-flex items-center gap-2 rounded-full border border-hairline bg-white/85 px-3 py-1.5 text-[13px] text-sub"
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
          </div>
        </section>

        <section aria-label="Số liệu nổi bật" className={`${container} pt-6`}>
          <dl className="card glass grid grid-cols-2 overflow-hidden md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-end border-hairline px-5 py-6 sm:px-8 sm:py-8 ${
                  i % 2 ? 'border-l' : ''
                } ${i > 1 ? 'border-t md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}
              >
                <dt className="mt-2 text-sm text-sub">{stat.label}</dt>
                <dd className="font-display text-3xl font-semibold sm:text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="ky-nang" data-aurora="0.45" className={`${container} py-20 sm:py-28`}>
          <SectionTitle>Kỹ năng</SectionTitle>
          <div className="card grid items-center gap-10 p-5 sm:p-9 lg:grid-cols-[4fr_8fr] lg:gap-12">
            <Radar axes={radarAxes} />
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <SkillMeter key={group.title} group={group} />
              ))}
            </div>
          </div>
          <div className="marquee mt-10">
            <ul className="marquee-track">
              {[...allTech, ...allTech].map((tech, i) => (
                <li key={i} aria-hidden={i >= allTech.length} className="mr-3">
                  <TechChip tech={tech} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="san-pham" data-aurora="0.6" className={`${container} py-20 sm:py-28`}>
          <SectionTitle>Sản phẩm</SectionTitle>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                hasImage={publicFileExists(project.image)}
                src={versionedSrc(project.image)}
              />
            ))}
          </div>
        </section>

        <section id="kinh-nghiem" data-aurora="0.45" className={`${container} py-20 sm:py-28`}>
          <SectionTitle>Kinh nghiệm</SectionTitle>
          <Timeline items={timeline} />
        </section>

        <section id="lien-he" data-aurora="0.9" className={`${container} pb-20 pt-10 sm:pb-28`}>
          <div className="card-feature glass relative isolate overflow-hidden px-4 py-16 text-center sm:px-12 sm:py-24">
            <Aurora className="absolute inset-0 -z-10" />
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
              <a
                href={`mailto:${site.email}`}
                className={`${buttonOutline} max-w-full break-all px-4 text-xs sm:px-5 sm:text-sm`}
              >
                <Mail aria-hidden="true" size={16} className="shrink-0" />
                {site.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <p className={`${container} py-6 text-sm text-sub`}>
          © {site.year} {site.fullName}
        </p>
      </footer>
    </>
  );
}
