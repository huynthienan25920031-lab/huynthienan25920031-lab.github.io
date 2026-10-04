# Portfolio — Thiên Ân (Adam)

Portfolio một trang: Next.js (App Router, TypeScript) + Tailwind CSS, xuất tĩnh để chạy trên GitHub Pages.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # xuất tĩnh ra thư mục out/
npm start        # xem thử bản tĩnh trong out/ (npx serve out)
```

## Chỉnh nội dung

Toàn bộ nội dung nằm trong `data/`, không cần đụng tới component:

| File | Nội dung |
| --- | --- |
| `data/site.ts` | Tên, trạng thái nhận dự án, tagline, số điện thoại, Zalo, email, ảnh chân dung, menu, dải số liệu |
| `data/skills.ts` | 6 trục radar, các nhóm kỹ năng (mức 1–5), danh sách chip công nghệ |
| `data/projects.ts` | Sản phẩm: nội dung, đường dẫn ảnh, kiểu khung (`browser` / `phone`) và cỡ ô bento (`featured`, `tall`, `default`, `small`) |
| `data/experience.ts` | Timeline kinh nghiệm và học vấn (không ghi tên công ty) |

## Ảnh

Ảnh nằm trong `public/images/` (danh sách và nguồn từng file ở `public/images/README.md`):

- `avatar.jpg`: ảnh chân dung ở hero, tỉ lệ 4:5.
- `<slug>-1.webp`: ảnh từng sản phẩm. Sản phẩm nào có `isMockup: true` trong `data/projects.ts` thì card hiện dòng
  "Giao diện minh họa · dữ liệu mẫu"; thay bằng ảnh chụp thật thì đặt `false`.
- Giao diện minh họa dựng bằng HTML tĩnh trong `mockups/` (ngoài app, không thành route). Sửa xong chạy
  `node mockups/capture.mjs` để chụp lại WebP 2x (cần Edge hoặc Chrome; đặt `BROWSER_PATH` nếu ở vị trí khác).
- Dải cực quang chính của hero là ảnh blur sẵn, tạo bằng `node scripts/make-aurora.mjs`.

Logo nằm ở `components/Logo.tsx`; favicon `app/icon.svg` và ảnh Open Graph dùng lại cùng các nét đó, sửa logo thì sửa cả ba.

## Hiệu năng

Chỉ navbar (khi đã cuộn), dải số liệu và khối liên hệ dùng `backdrop-filter`; các card khác là nền trắng 80% không blur. `components/QualityGuard.tsx` đo FPS thật khi vào trang và khi cuộn; máy nào không giữ được
khoảng 45fps thì các phần glass tự chuyển sang nền trắng 85% không blur. Thử tay bằng `?quality=low` hoặc `?quality=high` trên URL.

## Công nghệ và SEO

Thêm công nghệ mới: khai báo trong `tech` ở `data/skills.ts`. Icon lấy từ [devicon](https://devicon.dev)
(`devicon('ten/ten-original')`); công nghệ không có devicon thì dùng icon lucide đã khai báo trong `components/TechChip.tsx`.

Tiêu đề và mô tả SEO / Open Graph nằm ở `app/layout.tsx`. Ảnh Open Graph (1200×630) sinh lúc build bởi `app/og.png/route.tsx`,
dùng font trong `assets/fonts/`. Địa chỉ trang (`siteUrl`) nằm ở `data/site.ts`.

`public/` chứa hai trang tĩnh mang từ trang cũ sang (`product-demo.html`, `showcase.html`, kèm `style.css` và `script.js`);
navbar trỏ tới chúng qua mục "Trang mẫu" và "Gallery" trong `data/site.ts`.

## Deploy

1. Tạo repo `huynthienan25920031-lab.github.io` trên GitHub rồi push nhánh `main`.
2. Vào Settings → Pages → Source, chọn **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` tự build và deploy mỗi lần push lên `main`.

Trang chạy ở gốc tên miền `https://huynthienan25920031-lab.github.io` nên không cần `basePath`. Nếu chuyển sang repo dạng
`<user>.github.io/<repo>`, thêm `basePath: '/<repo>'` vào `next.config.ts`, sửa `siteUrl` và hai link `.html` trong `data/site.ts`.
