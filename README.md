# Portfolio — Thiên Ân (Adam)

Portfolio một trang: Next.js (App Router, TypeScript) + Tailwind CSS, xuất tĩnh để chạy trên GitHub Pages.

## Chạy

```bash
npm install
npm run dev      # http://localhost:3000/anhuynh-engineer
npm run build    # xuất tĩnh ra thư mục out/
```

Vì có `basePath`, trang nằm ở `/anhuynh-engineer`, không phải `/`.

## Chỉnh nội dung

Toàn bộ nội dung nằm trong `data/`, không cần đụng tới component:

| File | Nội dung |
| --- | --- |
| `data/site.ts` | Tên, trạng thái nhận dự án, tagline, số điện thoại, Zalo, email, menu, dải số liệu |
| `data/skills.ts` | 6 trục radar, các nhóm kỹ năng (mức 1–5), danh sách chip công nghệ |
| `data/projects.ts` | Sản phẩm. `size: 'featured'` là card chủ lực, `'default'` vào lưới 2 cột, `'small'` là card nhỏ |
| `data/experience.ts` | Timeline kinh nghiệm và học vấn (không ghi tên công ty) |

Thêm công nghệ mới: khai báo trong `tech` ở `data/skills.ts`. Icon lấy từ [devicon](https://devicon.dev)
(`devicon('ten/ten-original')`); công nghệ không có devicon thì dùng icon lucide đã khai báo trong `components/TechChip.tsx`.

Tiêu đề và mô tả SEO / Open Graph nằm ở `app/layout.tsx`. Ảnh Open Graph (1200×630) sinh lúc build bởi `app/og.png/route.tsx`,
dùng font trong `assets/fonts/`. Địa chỉ trang (`siteUrl`) nằm ở `data/site.ts`.

`public/` chứa hai trang tĩnh mang từ trang cũ sang (`product-demo.html`, `showcase.html`, kèm `style.css` và `script.js`);
navbar trỏ tới chúng qua mục "Trang mẫu" và "Gallery" trong `data/site.ts`.

## Deploy

1. Tạo repo `anhuynh-engineer` trên GitHub rồi push nhánh `main`.
2. Vào Settings → Pages → Source, chọn **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` tự build và deploy mỗi lần push lên `main`.

Nếu đổi tên repo, sửa `basePath` trong `next.config.ts` và `basePath`, `siteUrl` trong `data/site.ts` cho khớp.
