import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Kiểm tra lúc build xem file trong public/ đã có chưa (chưa có thì hiển thị placeholder). */
export const publicFileExists = (path: string) => existsSync(join(process.cwd(), 'public', path));
