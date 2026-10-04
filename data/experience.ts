export type TimelineItem = {
  period: string;
  title: string;
  kind: 'work' | 'education';
  points: string[];
};

// Lưu ý: không ghi tên công ty ở đây.
export const timeline: TimelineItem[] = [
  {
    period: '2025',
    title: 'AI Software Engineer',
    kind: 'work',
    points: [
      'Xây CRM theo kiến trúc module hóa',
      'Tích hợp LLM API vào quy trình nghiệp vụ',
      'Thiết kế REST API kèm phân quyền RBAC',
      'Docker cho cả môi trường dev và prod',
      'Giữ uptime 99.9%',
    ],
  },
  {
    period: '2024–2025',
    title: 'Vận hành web và sàn TMĐT',
    kind: 'work',
    points: [
      'Đồng bộ dữ liệu real-time giữa web và sàn',
      'Technical SEO',
      'Chatbot LLM',
      'ETL dữ liệu',
      'Viết SOP và đào tạo',
    ],
  },
  {
    period: '2024–nay',
    title: 'Freelance',
    kind: 'work',
    points: ['Tư vấn và build trọn gói', 'Có unit test trước khi bàn giao'],
  },
  {
    period: '2021–2025',
    title: 'Học vấn',
    kind: 'education',
    points: ['Thương mại điện tử, ĐH Văn Hiến'],
  },
];
