export type Project = {
  /** Dùng đặt tên ảnh: public/images/<slug>-1.png */
  slug: string;
  title: string;
  description: string;
  /**
   * Kích thước ô trong lưới bento:
   * featured: chiếm 2 cột, cao, ảnh lớn · tall: cao 2 hàng · default: ô thường · small: ô nhỏ nằm ngang
   */
  size: 'featured' | 'tall' | 'default' | 'small';
  /** Ảnh chụp sản phẩm. Chưa có file thì card hiện placeholder gradient kèm tên. */
  image: string;
  /** Phần ảnh được giữ lại khi khung cắt bớt (CSS object-position). Mặc định 'top'. */
  imagePosition?: string;
  /** Khung bao quanh ảnh: cửa sổ trình duyệt hoặc điện thoại. */
  frame: 'browser' | 'phone';
  features?: string[];
  stack?: string[];
  /** Hiển thị thành badge nổi bật ở cuối card. */
  result?: string;
};

const image = (slug: string) => `/images/${slug}-1.png`;

export const projects: Project[] = [
  {
    slug: 'thinknote',
    title: 'ThinkNote',
    size: 'featured',
    image: image('thinknote'),
    frame: 'browser',
    description: 'Ghi chú và lập kế hoạch có AI đi cùng.',
    features: [
      'Chat AI',
      'Nhập bằng giọng nói',
      'Theo dõi task 30 ngày',
      'Đồng bộ đa nền tảng (PWA)',
    ],
    stack: ['Next.js', 'React', 'Supabase', 'AI', 'PWA'],
  },
  {
    slug: 'crm-ai',
    title: 'CRM nội bộ có AI',
    size: 'tall',
    image: image('crm-ai'),
    imagePosition: 'left top',
    frame: 'browser',
    description: 'AI phân loại và nhập dữ liệu, kiến trúc module, phân quyền RBAC.',
    stack: ['Next.js', 'Node.js', 'Docker', 'LLM'],
    result: 'Giảm 60–70% thời gian xử lý',
  },
  {
    slug: 'booking',
    title: 'Booking đa kênh',
    size: 'default',
    image: image('booking'),
    frame: 'browser',
    description: 'SPA hợp nhất lịch hẹn, AI Agent xếp lịch và chia nhân sự.',
    stack: ['React', 'Node.js', 'Docker', 'AI'],
    result: 'Một app thay nhiều kênh rời rạc',
  },
  {
    slug: 'chatbot',
    title: 'Chatbot chăm sóc khách',
    size: 'default',
    image: image('chatbot'),
    frame: 'phone',
    description: 'NLP/LLM, chạy 24/7, đồng bộ với CRM.',
    result: 'Phản hồi dưới 30 giây',
  },
  {
    slug: 'web-ban-hang',
    title: 'Web bán hàng tốc độ cao',
    size: 'default',
    image: image('web-ban-hang'),
    frame: 'browser',
    description: 'Tối ưu Core Web Vitals, JSON-LD, đồng bộ real-time với sàn TMĐT.',
    result: 'Render nhanh hơn 40%',
  },
  {
    slug: 'ai-seo',
    title: 'AI SEO Generator',
    size: 'small',
    image: image('ai-seo'),
    frame: 'browser',
    description: 'Scraping, semantic keyword, sinh nội dung.',
  },
  {
    slug: 'hrm',
    title: 'Internal HRM',
    size: 'small',
    image: image('hrm'),
    frame: 'browser',
    description: 'Tính công, xếp ca, phân quyền.',
  },
];
