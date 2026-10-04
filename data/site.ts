export const site = {
  name: 'Thiên Ân',
  fullName: 'Thiên Ân (Adam)',
  status: 'đang nhận dự án · q4/2026',
  tagline: 'Kỹ sư fullstack đưa AI vào những quy trình còn làm bằng tay.',
  phone: '0985 905 443',
  phoneHref: 'tel:0985905443',
  zaloHref: 'https://zalo.me/0985905443',
  email: 'huynhthienan25920031@gmail.com',
  /** Ảnh chân dung trong hero, nằm ở public/images/. Chưa có file thì hiện placeholder. */
  avatar: '/images/avatar.jpg',
  year: 2026,
};

/** Địa chỉ trang khi deploy (repo huynhthienan25920031-lab.github.io, phục vụ ở gốc tên miền). */
export const siteUrl = 'https://huynhthienan25920031-lab.github.io';
/** Ảnh Open Graph, sinh lúc build bởi app/og.png/route.tsx. */
export const ogImage = { url: `${siteUrl}/og.png`, width: 1200, height: 630 };

export const nav = [
  { label: 'Kỹ năng', href: '#ky-nang' },
  { label: 'Sản phẩm', href: '#san-pham' },
  { label: 'Kinh nghiệm', href: '#kinh-nghiem' },
  { label: 'Trang mẫu', href: '/product-demo.html' },
  { label: 'Gallery', href: '/showcase.html' },
  { label: 'Liên hệ', href: '#lien-he' },
];

export const stats = [
  { value: '60–70%', label: 'thời gian vận hành giảm' },
  { value: '99.9%', label: 'uptime hệ thống' },
  { value: '<30s', label: 'chatbot phản hồi' },
  { value: '+40%', label: 'tốc độ render' },
];
