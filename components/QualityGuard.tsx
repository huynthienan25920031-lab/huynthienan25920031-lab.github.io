'use client';

import { useEffect } from 'react';

const WINDOW_MS = 1500;
const MIN_FPS = 45;
const SLOW_WINDOWS = 2; // hai lần đo liên tiếp dưới ngưỡng mới hạ chất lượng

/**
 * Chế độ tự hạ chất lượng. Đo FPS thật trong vài cửa sổ ngắn (lúc mới vào trang và khi cuộn);
 * nếu máy không giữ nổi ~45fps thì đặt <html data-quality="low">: CSS bỏ backdrop-filter của
 * card glass và thay bằng nền trắng 85% (xem globals.css).
 * Ép tay để thử: thêm ?quality=low hoặc ?quality=high vào URL.
 */
export default function QualityGuard() {
  useEffect(() => {
    const root = document.documentElement;
    const forced = new URLSearchParams(window.location.search).get('quality');
    if (forced === 'low') root.dataset.quality = 'low';
    if (forced === 'low' || forced === 'high') return;

    let raf = 0;
    let sampling = false;
    let frames = 0;
    let started = 0;
    let slow = 0;

    const lower = () => {
      root.dataset.quality = 'low';
      window.removeEventListener('scroll', begin);
    };

    const tick = (now: number) => {
      if (!started) started = now;
      frames++;
      const elapsed = now - started;
      if (elapsed < WINDOW_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      sampling = false;
      const fps = ((frames - 1) * 1000) / elapsed;
      slow = fps < MIN_FPS ? slow + 1 : 0;
      if (slow >= SLOW_WINDOWS) lower();
      else if (slow > 0) begin(); // đo lại ngay để xác nhận
    };

    function begin() {
      if (sampling || document.hidden || root.dataset.quality === 'low') return;
      sampling = true;
      frames = 0;
      started = 0;
      raf = requestAnimationFrame(tick);
    }

    const first = window.setTimeout(begin, 1200); // bỏ qua giai đoạn tải trang
    window.addEventListener('scroll', begin, { passive: true });
    return () => {
      window.clearTimeout(first);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', begin);
    };
  }, []);

  return null;
}
