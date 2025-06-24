# ModernStore - Nền tảng thương mại điện tử hiện đại

ModernStore là một nền tảng thương mại điện tử đầy đủ tính năng, được xây dựng với NestJS (backend) và React (frontend).

## Tổng quan

ModernStore cung cấp các tính năng:

- **Giao diện người dùng trực quan**: Trải nghiệm mua sắm mượt mà và thân thiện với người dùng
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm với nhiều tùy chọn
- **Quản lý đơn hàng**: Theo dõi và quản lý đơn hàng từ khi đặt đến khi giao
- **Quản lý người dùng**: Phân quyền và quản lý tài khoản người dùng
- **Báo cáo và phân tích**: Thống kê doanh thu và phân tích xu hướng bán hàng
- **Khuyến mãi và giảm giá**: Tạo và quản lý các chương trình khuyến mãi

## Cấu trúc dự án

```
modernstore/
├── backend/               # NestJS backend
│   ├── src/               # Mã nguồn
│   ├── prisma/            # Schema và migrations Prisma
│   └── test/              # Unit và e2e tests
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   └── src/               # Mã nguồn
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       ├── hooks/         # Custom hooks
│       ├── pages/         # Page components
│       └── services/      # API services
└── TODOLIST.md            # Kế hoạch triển khai
```

## Yêu cầu hệ thống

- Node.js 18.x trở lên
- PostgreSQL 14.x trở lên
- npm 9.x trở lên

## Cài đặt và triển khai

### Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

3. Tạo file .env với cấu hình kết nối database:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/modernstore?schema=public"
   JWT_SECRET="your-jwt-secret-key"
   JWT_EXPIRES_IN="1d"
   PORT=3000
   ```

4. Chạy migration để tạo database schema:
   ```bash
   npx prisma migrate dev
   ```

5. Seed database với dữ liệu mẫu:
   ```bash
   npm run seed
   ```

6. Khởi động server ở chế độ development:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   ```

3. Tạo file .env với cấu hình API:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Khởi động frontend ở chế độ development:
   ```bash
   npm run dev
   ```

## Tài khoản mặc định

Sau khi chạy seed script, bạn có thể đăng nhập với các tài khoản sau:

- **Admin**:
  - Email: admin@example.com
  - Password: admin123

- **User**:
  - Email: user@example.com
  - Password: user123

## API Documentation

API documentation có sẵn tại http://localhost:3000/api/docs sau khi khởi động backend.

## Kế hoạch phát triển

Xem file [TODOLIST.md](./TODOLIST.md) để biết chi tiết về kế hoạch phát triển và triển khai các tính năng mới.

## Công nghệ sử dụng

### Backend
- NestJS - Framework Node.js
- Prisma - ORM
- PostgreSQL - Database
- JWT - Authentication
- Jest - Testing

### Frontend
- React - UI Library
- TypeScript - Language
- TailwindCSS - Styling
- React Router - Routing
- React Query - Server State Management
- Vite - Build Tool

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng tạo pull request hoặc mở issue để thảo luận về những thay đổi bạn muốn thực hiện.

## Giấy phép

[MIT](LICENSE)
