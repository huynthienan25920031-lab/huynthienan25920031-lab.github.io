export type Project = {
  title: string;
  description: string;
  /** featured: card chủ lực rộng full · default: lưới 2 cột · small: card nhỏ */
  size: 'featured' | 'default' | 'small';
  features?: string[];
  stack?: string[];
  /** Hiển thị bằng mono xanh, tự thêm "→" ở đầu. */
  result?: string;
};

export const projects: Project[] = [
  {
    title: 'ThinkNote',
    size: 'featured',
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
    title: 'CRM nội bộ có AI',
    size: 'default',
    description: 'AI phân loại và nhập dữ liệu, kiến trúc module, phân quyền RBAC.',
    stack: ['Next.js', 'Node.js', 'Docker', 'LLM'],
    result: 'giảm 60–70% thời gian xử lý',
  },
  {
    title: 'Booking đa kênh',
    size: 'default',
    description: 'SPA hợp nhất lịch hẹn, AI Agent xếp lịch và chia nhân sự.',
    stack: ['React', 'Node.js', 'Docker', 'AI'],
    result: 'một app thay nhiều kênh rời rạc',
  },
  {
    title: 'Chatbot chăm sóc khách',
    size: 'default',
    description: 'NLP/LLM, chạy 24/7, đồng bộ với CRM.',
    result: 'phản hồi dưới 30 giây',
  },
  {
    title: 'Web bán hàng tốc độ cao',
    size: 'default',
    description: 'Tối ưu Core Web Vitals, JSON-LD, đồng bộ real-time với sàn TMĐT.',
    result: 'render nhanh hơn 40%',
  },
  {
    title: 'AI SEO Generator',
    size: 'small',
    description: 'Scraping, semantic keyword, sinh nội dung.',
  },
  {
    title: 'Internal HRM',
    size: 'small',
    description: 'Tính công, xếp ca, phân quyền.',
  },
];
