# Lưu Load V2

Next.js (App Router) + TypeScript + Tailwind v4. Quy tắc và token: `docs/IMPLEMENTATION.md`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Trạng thái
- Đã dựng: Header, Hero, Break Section ở breakpoint 1920.
- Chưa có: 1440 / 768 / 390, motion, các trang còn lại.
- Font: Smooch Sans đang lấy tạm từ `@fontsource/smooch-sans`; Aeonik chưa có file (dùng font hệ thống). Thay bằng file trong `public/assets/fonts/` khi có.

## Font SVN-Gilroy (cần thêm thủ công)

SVN-Gilroy là font thương mại nên **không** được commit vào repo. Đặt `SVN-Gilroy-Medium.otf` vào
`public/assets/fonts/gilroy/` trước khi chạy (không có file, trang sẽ dùng font hệ thống dự phòng
và xuống dòng có thể lệch so với Figma). Khi có license web, có thể bỏ dòng tương ứng trong `.gitignore`.
