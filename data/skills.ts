/**
 * Icon công nghệ:
 * - devicon: đường dẫn trong repo devicon, ví dụ 'nextjs/nextjs-original'
 *   (tra tại https://devicon.dev)
 * - lucide: tên icon đã khai báo trong components/TechChip.tsx
 */
export type TechIcon =
  | { type: 'devicon'; path: string }
  | { type: 'lucide'; name: 'sparkles' | 'bot' | 'message' | 'braces' | 'smartphone' };

export type Tech = { name: string; icon: TechIcon };

const devicon = (path: string): TechIcon => ({ type: 'devicon', path });

const tech = {
  next: { name: 'Next.js', icon: devicon('nextjs/nextjs-original') },
  react: { name: 'React', icon: devicon('react/react-original') },
  js: { name: 'JavaScript', icon: devicon('javascript/javascript-original') },
  node: { name: 'Node.js', icon: devicon('nodejs/nodejs-original') },
  php: { name: 'PHP', icon: devicon('php/php-original') },
  rest: { name: 'RESTful API', icon: { type: 'lucide', name: 'braces' } },
  llm: { name: 'LLM API', icon: { type: 'lucide', name: 'sparkles' } },
  agent: { name: 'AI Agent', icon: { type: 'lucide', name: 'bot' } },
  chatbot: { name: 'Chatbot', icon: { type: 'lucide', name: 'message' } },
  docker: { name: 'Docker', icon: devicon('docker/docker-original') },
  git: { name: 'Git/GitHub', icon: devicon('git/git-original') },
  postman: { name: 'Postman', icon: devicon('postman/postman-original') },
  figma: { name: 'Figma', icon: devicon('figma/figma-original') },
  supabase: { name: 'Supabase', icon: devicon('supabase/supabase-original') },
  pwa: { name: 'PWA', icon: { type: 'lucide', name: 'smartphone' } },
} satisfies Record<string, Tech>;

/** Radar 6 trục, thang 0–100. */
export const radarAxes = [
  { label: 'Fullstack', value: 90 },
  { label: 'AI workflow', value: 85 },
  { label: 'Kiến trúc', value: 75 },
  { label: 'DevOps', value: 75 },
  { label: 'Hiệu năng & SEO', value: 80 },
  { label: 'UI/UX', value: 70 },
];

/** Nhãn cho mức 1 → 5. */
export const levelLabels = ['Làm quen', 'Cơ bản', 'Vững', 'Thành thạo', 'Chuyên sâu'];

export type SkillGroup = {
  title: string;
  skills: (Tech & { level: 1 | 2 | 3 | 4 | 5 })[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    skills: [
      { ...tech.next, level: 5 },
      { ...tech.react, level: 4 },
      { ...tech.js, level: 5 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { ...tech.node, level: 4 },
      { ...tech.php, level: 3 },
      { ...tech.rest, level: 4 },
    ],
  },
  {
    title: 'AI',
    skills: [
      { ...tech.llm, level: 4 },
      { ...tech.agent, level: 4 },
      { ...tech.chatbot, level: 4 },
    ],
  },
  {
    title: 'Hạ tầng',
    skills: [
      { ...tech.docker, level: 4 },
      { ...tech.git, level: 4 },
      { ...tech.postman, level: 4 },
      { ...tech.figma, level: 3 },
    ],
  },
];

/** Dải chip chạy marquee dưới phần kỹ năng. */
export const allTech: Tech[] = Object.values(tech);
