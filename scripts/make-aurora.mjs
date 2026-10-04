// Tạo ảnh dải cực quang đã blur sẵn (lặp liền mạch theo chiều ngang) cho hero.
// Chạy lại khi muốn đổi màu hay dáng sóng:  node scripts/make-aurora.mjs
import sharp from 'sharp';

const PERIOD = 1600;
const HEIGHT = 520;
const BLUR = 34;

const variants = {
  // cyan → tím → hồng
  'aurora-ribbon': ['#67E8F9', '#A78BFA', '#F9A8D4'],
  // lớp thứ hai, hiện dần khi cuộn: hồng → tím → xanh
  'aurora-ribbon-b': ['#F9A8D4', '#A78BFA', '#93C5FD'],
};

function ribbonSvg([c0, c1, c2]) {
  const width = PERIOD * 3; // vẽ 3 chu kỳ rồi cắt chu kỳ giữa để mép lặp liền mạch sau khi blur
  const top = [];
  const bottom = [];
  for (let x = 0; x <= width; x += 16) {
    const phase = (2 * Math.PI * x) / PERIOD;
    const centre = HEIGHT / 2 + 78 * Math.sin(phase);
    const half = 58 + 26 * Math.sin(phase * 2 + 1.1);
    top.push(`${x},${(centre - half).toFixed(1)}`);
    bottom.unshift(`${x},${(centre + half).toFixed(1)}`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}">
    <defs>
      <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" x2="${PERIOD}" y1="0" y2="0" spreadMethod="repeat">
        <stop offset="0" stop-color="${c0}"/>
        <stop offset="0.34" stop-color="${c1}"/>
        <stop offset="0.67" stop-color="${c2}"/>
        <stop offset="1" stop-color="${c0}"/>
      </linearGradient>
    </defs>
    <polygon points="${[...top, ...bottom].join(' ')}" fill="url(#g)" fill-opacity="0.9"/>
  </svg>`;
}

for (const [name, colours] of Object.entries(variants)) {
  const blurred = await sharp(Buffer.from(ribbonSvg(colours))).blur(BLUR).png().toBuffer();
  const file = `public/images/${name}.webp`;
  const info = await sharp(blurred)
    .extract({ left: PERIOD, top: 0, width: PERIOD, height: HEIGHT })
    .webp({ quality: 78, alphaQuality: 80 })
    .toFile(file);
  console.log(file, `${info.width}x${info.height}`, `${info.size} bytes`);
}
