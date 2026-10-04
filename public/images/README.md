# Ảnh của trang

| File | Dùng ở đâu | Nguồn |
| --- | --- | --- |
| `avatar.jpg` | Ảnh chân dung trong hero (960×1200, tỉ lệ 4:5) | Cắt từ `avatar cv.jpg` |
| `thinknote-1.webp` | Card ThinkNote | Ảnh chụp thật: app chạy local với dữ liệu mẫu |
| `crm-ai-1.webp` | CRM nội bộ có AI | Giao diện minh họa (`mockups/crm-ai.html`) |
| `booking-1.webp` | Booking đa kênh | Giao diện minh họa |
| `chatbot-1.webp` | Chatbot chăm sóc khách (khung điện thoại 9:19.5) | Giao diện minh họa |
| `web-ban-hang-1.webp` | Web bán hàng tốc độ cao | Giao diện minh họa |
| `ai-seo-1.webp` | AI SEO Generator | Giao diện minh họa |
| `hrm-1.webp` | Internal HRM | Giao diện minh họa |
| `aurora-ribbon.webp`, `aurora-ribbon-b.webp` | Dải cực quang chính của hero | `node scripts/make-aurora.mjs` |

Ảnh sản phẩm khung trình duyệt là 1920×1200 (16:10). Đường dẫn và cờ `isMockup` khai báo trong
`data/projects.ts`; avatar khai báo trong `data/site.ts`.

Thay một ảnh minh họa bằng ảnh chụp thật: ghi đè file `<slug>-1.webp`, đặt `isMockup: false` cho sản phẩm đó
(dòng "Giao diện minh họa · dữ liệu mẫu" tự ẩn), rồi build lại. File nào thiếu thì card hiện placeholder gradient.
