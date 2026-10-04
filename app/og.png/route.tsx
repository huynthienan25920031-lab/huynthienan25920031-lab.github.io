import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { ogImage, site } from '@/data/site';

export const dynamic = 'force-static';
const size = { width: ogImage.width, height: ogImage.height };

// Cùng 3 dải ruy băng với components/Aurora.tsx, vẽ tĩnh làm nền
const aurora = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 600" preserveAspectRatio="none">
  <defs>
    <filter id="blur" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="30"/></filter>
    <linearGradient id="a"><stop offset="0" stop-color="#67E8F9" stop-opacity="0"/><stop offset=".3" stop-color="#67E8F9" stop-opacity=".55"/><stop offset=".7" stop-color="#A78BFA" stop-opacity=".55"/><stop offset="1" stop-color="#A78BFA" stop-opacity="0"/></linearGradient>
    <linearGradient id="b"><stop offset="0" stop-color="#F9A8D4" stop-opacity="0"/><stop offset=".3" stop-color="#F9A8D4" stop-opacity=".5"/><stop offset=".7" stop-color="#93C5FD" stop-opacity=".5"/><stop offset="1" stop-color="#93C5FD" stop-opacity="0"/></linearGradient>
    <linearGradient id="c"><stop offset="0" stop-color="#6EE7B7" stop-opacity="0"/><stop offset=".3" stop-color="#6EE7B7" stop-opacity=".45"/><stop offset=".7" stop-color="#67E8F9" stop-opacity=".45"/><stop offset="1" stop-color="#67E8F9" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1200" height="600" fill="#F6F6FA"/>
  <g filter="url(#blur)">
    <path fill="url(#a)" d="M-100 190 C 150 90, 380 300, 640 180 S 1080 90, 1300 200 L 1300 290 C 1080 190, 860 370, 640 280 S 150 200, -100 300 Z"/>
    <path fill="url(#b)" d="M-100 330 C 200 420, 420 220, 700 320 S 1100 430, 1300 300 L 1300 390 C 1100 520, 900 330, 700 410 S 200 500, -100 420 Z"/>
    <path fill="url(#c)" d="M-100 450 C 180 360, 460 520, 760 430 S 1120 360, 1300 450 L 1300 520 C 1120 440, 900 580, 760 510 S 180 440, -100 530 Z"/>
  </g>
</svg>`;

// Cùng các nét với components/Logo.tsx
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 32 32" fill="none" stroke="url(#g)" stroke-linecap="round" stroke-linejoin="round">
  <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="5" y1="28" x2="27" y2="3"><stop offset="0" stop-color="#06B6D4"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs>
  <path d="M6.5 28 16 9.5 25.5 28" stroke-width="2.8"/>
  <ellipse cx="16" cy="21" rx="13" ry="3.6" transform="rotate(-16 16 21)" stroke-width="1.7"/>
  <path d="M12 6.2 16 2.6 20 6.2" stroke-width="2.4"/>
</svg>`;

const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export async function GET() {
  const [bold, medium] = await Promise.all([font('BeVietnamPro-Bold.ttf'), font('BeVietnamPro-Medium.ttf')]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#F6F6FA',
          fontFamily: 'Be Vietnam Pro',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          width={1200}
          height={630}
          src={dataUri(aurora)}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 96px',
            width: '100%',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#4B4A57' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" width={60} height={60} src={dataUri(logo)} style={{ marginRight: 16 }} />
            {site.fullName}
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 148,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#14131A',
            }}
          >
            {site.name}
          </div>
          <div style={{ marginTop: 28, maxWidth: 860, fontSize: 40, lineHeight: 1.35, color: '#4B4A57' }}>
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: bold, weight: 700, style: 'normal' },
        { name: 'Be Vietnam Pro', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
