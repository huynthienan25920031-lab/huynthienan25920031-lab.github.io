export type Project = {
  /** Dùng đặt tên ảnh: public/images/<slug>-1.webp */
  slug: string;
  title: string;
  description: string;
  /**
   * Kích thước ô trong lưới bento (6 cột ở desktop):
   * featured: 4 cột × 2 hàng, mang nhãn "Sản phẩm chủ lực" · default: 2 cột · tall: 2 cột × 2 hàng · small: 2 cột, nằm ngang
   */
  size: 'featured' | 'tall' | 'default' | 'small';
  /** Ảnh sản phẩm. Chưa có file thì card hiện placeholder gradient kèm tên. */
  image: string;
  /**
   * true: ảnh là giao diện minh họa dựng trong mockups/ với dữ liệu mẫu, card hiện dòng
   * "Giao diện minh họa · dữ liệu mẫu" dưới khung ảnh. Thay bằng ảnh chụp thật thì đặt false.
   */
  isMockup: boolean;
  /** Phần ảnh được giữ lại khi khung cắt bớt (CSS object-position). Mặc định 'top'. */
  imagePosition?: string;
  /** Khung bao quanh ảnh: cửa sổ trình duyệt (16:10) hoặc điện thoại (9:19.5). */
  frame: 'browser' | 'phone';
  stack?: string[];
  /** Hiển thị thành badge nổi bật ở cuối card. */
  result?: string;
};

const image = (slug: string) => `/images/${slug}-1.webp`;

export const projects: Project[] = [
  {
    slug: 'crm-ai',
    title: 'CRM nội bộ có AI',
    size: 'featured',
    image: image('crm-ai'),
    isMockup: true,
    frame: 'browser',
    description: 'AI phân loại và nhập dữ liệu, kiến trúc module, phân quyền RBAC.',
    stack: ['Next.js', 'Node.js', 'Docker', 'LLM'],
    result: 'Giảm 60–70% thời gian xử lý',
  },
  {
    slug: 'thinknote',
    title: 'ThinkNote',
    size: 'default',
    image: image('thinknote'),
    isMockup: false, // ảnh chụp thật, chạy local với dữ liệu mẫu
    frame: 'browser',
    description:
      'Lập lịch làm việc thông minh có AI đi cùng: lịch tuần, theo dõi khối lượng giờ làm, AI Assistant gợi ý và sắp xếp lịch, đồng bộ đa nền tảng (PWA).',
    stack: ['Next.js', 'React', 'Supabase', 'AI', 'PWA'],
  },
  {
    slug: 'ai-seo',
    title: 'AI SEO Generator',
    size: 'small',
    image: image('ai-seo'),
    isMockup: true,
    frame: 'browser',
    description: 'Scraping, semantic keyword, sinh nội dung.',
  },
  {
    slug: 'chatbot',
    title: 'Chatbot chăm sóc khách',
    size: 'tall',
    image: image('chatbot'),
    isMockup: true,
    frame: 'phone',
    description: 'NLP/LLM, chạy 24/7, đồng bộ với CRM.',
    result: 'Phản hồi dưới 30 giây',
  },
  {
    slug: 'web-ban-hang',
    title: 'Web bán hàng tốc độ cao',
    size: 'tall',
    image: image('web-ban-hang'),
    isMockup: true,
    frame: 'browser',
    description: 'Tối ưu Core Web Vitals, JSON-LD, đồng bộ real-time với sàn TMĐT.',
    result: 'Render nhanh hơn 40%',
  },
  {
    slug: 'booking',
    title: 'Booking đa kênh',
    size: 'default',
    image: image('booking'),
    isMockup: true,
    frame: 'browser',
    description: 'SPA hợp nhất lịch hẹn, AI Agent xếp lịch và chia nhân sự.',
    stack: ['React', 'Node.js', 'Docker', 'AI'],
    result: 'Một app thay nhiều kênh rời rạc',
  },
  {
    slug: 'hrm',
    title: 'Internal HRM',
    size: 'small',
    image: image('hrm'),
    isMockup: true,
    frame: 'browser',
    description: 'Tính công, xếp ca, phân quyền.',
  },
];
