import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Bricolage_Grotesque } from 'next/font/google';
import { ogImage, site, siteUrl } from '@/data/site';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

const sans = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-bevietnam',
  display: 'swap',
});

const title = 'Thiên Ân (Adam) · Kỹ sư fullstack & AI workflow';
const description =
  'Kỹ sư fullstack đưa AI vào những quy trình còn làm bằng tay: CRM có AI, chatbot, booking đa kênh, web bán hàng tốc độ cao.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: 'Thiên Ân (Adam)' }],
  keywords: ['Thiên Ân', 'fullstack', 'Next.js', 'AI workflow', 'AI Agent', 'chatbot', 'CRM'],
  openGraph: {
    title,
    description,
    type: 'website',
    url: siteUrl,
    locale: 'vi_VN',
    siteName: 'Thiên Ân (Adam)',
    images: [{ ...ogImage, alt: `${site.fullName} · ${site.tagline}` }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
};

export const viewport: Viewport = {
  themeColor: '#FBFBFE',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
