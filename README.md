# Full Web Starter

Website starter gồm:
- Homepage
- Tools
- Store
- Resources
- Blog
- Dashboard người dùng
- Admin login + CRUD nội dung cơ bản
- SQLite tự tạo dữ liệu mẫu

## Chạy local
```bash
npm install
npm run dev
```
Mở `http://localhost:3000`

## Admin mặc định
- URL: `/admin/login`
- Password mặc định: `admin123`

Hãy đổi khi deploy bằng biến môi trường:
```bash
ADMIN_PASSWORD=mat-khau-moi
SESSION_SECRET=mot-session-secret-dai
```

## Deploy lên Render
- Build command: `npm install`
- Start command: `npm start`
- Thêm biến môi trường `ADMIN_PASSWORD` và `SESSION_SECRET`
- Gắn domain riêng trong phần Custom Domains

## Ghi chú
Đây là starter chạy được để bạn gắn domain và tiếp tục phát triển.
Phần thanh toán, đăng nhập người dùng thật, upload file thật, và logic tool backend thật cần làm thêm theo nhu cầu.
