import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const file = (path: string) => join(process.cwd(), 'public', path);

/** Kiểm tra lúc build xem file trong public/ đã có chưa (chưa có thì hiển thị placeholder). */
export const publicFileExists = (path: string) => existsSync(file(path));

/**
 * Đường dẫn kèm ?v=<mã băm nội dung>. Ảnh sản phẩm giữ nguyên tên file khi thay ảnh mới, nên nếu
 * không có mã này trình duyệt có thể tiếp tục hiện ảnh cũ trong cache.
 */
export function versionedSrc(path: string) {
  if (!existsSync(file(path))) return path;
  return `${path}?v=${createHash('sha1').update(readFileSync(file(path))).digest('hex').slice(0, 8)}`;
}
