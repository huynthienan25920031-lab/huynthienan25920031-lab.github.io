'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/data/site';
import Logo from './Logo';

const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // backdrop-blur chỉ bật sau khi đã cuộn qua hero (đè lên canvas đang chạy thì rất tốn)
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: '-56px 0px 0px 0px',
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-hairline transition-colors ${
        pastHero ? 'bg-white/70 backdrop-blur-md' : 'bg-white/85'
      }`}
    >
      <nav aria-label="Điều hướng chính" className={`${container} flex h-14 items-center justify-between`}>
        <a
          href="#top"
          className="flex items-center gap-2"
          aria-label={`${site.name}, về đầu trang`}
          onClick={() => setOpen(false)}
        >
          <Logo size={30} animated />
          <span className="font-display text-[17px] font-semibold">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-6 text-sm text-sub sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="whitespace-nowrap py-2 transition-colors hover:text-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 grid h-10 w-10 place-items-center rounded-lg text-ink sm:hidden"
          aria-label={open ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-hairline bg-white sm:hidden"
      >
        <ul className={`${container} py-2`}>
          {nav.map((item) => (
            <li key={item.href} className="border-t border-hairline first:border-t-0">
              <a href={item.href} className="block py-3.5 text-base text-ink" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
