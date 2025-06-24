# ModernStore - Kế hoạch triển khai đầy đủ

## Giai đoạn 1: Hoàn thiện Dashboard Admin (2 tuần)

### Tuần 1: Dashboard và thống kê
- [x] Tạo API endpoint cho thống kê tổng quan (`GET /admin/dashboard/stats`)
- [x] Tạo API endpoint cho biểu đồ doanh số (`GET /admin/dashboard/sales`)
- [x] Tạo API endpoint cho sản phẩm bán chạy (`GET /admin/dashboard/top-products`)
- [x] Tạo API endpoint cho đơn hàng mới nhất (`GET /admin/dashboard/recent-orders`)
- [x] Thiết kế và phát triển giao diện Dashboard với các widget thống kê
- [x] Tích hợp thư viện biểu đồ (Chart.js hoặc Recharts) vào Dashboard
- [x] Hiển thị biểu đồ doanh số theo thời gian (ngày/tuần/tháng)
- [x] Hiển thị danh sách sản phẩm bán chạy

### Tuần 2: Nâng cấp quản lý đơn hàng
- [x] Tạo API endpoint cập nhật trạng thái đơn hàng (`PATCH /admin/orders/:id/status`)
- [x] Tạo API endpoint lọc đơn hàng nâng cao (`GET /admin/orders` với query params)
- [x] Tạo API endpoint xuất báo cáo đơn hàng (`GET /admin/orders/export`)
- [x] Phát triển giao diện chi tiết đơn hàng với khả năng cập nhật trạng thái
- [x] Thêm bộ lọc nâng cao cho trang danh sách đơn hàng (theo khoảng thời gian, giá trị)
- [x] Thêm chức năng xuất báo cáo đơn hàng (PDF, Excel)
- [x] Thêm chức năng gửi email thông báo khi cập nhật trạng thái đơn hàng

## Giai đoạn 2: Quản lý sản phẩm nâng cao (2 tuần)

### Tuần 3: Quản lý danh mục và biến thể sản phẩm
- [ ] Tạo model và migration cho bảng Categories trong Prisma schema
- [ ] Tạo CRUD API endpoints cho danh mục sản phẩm
- [ ] Phát triển giao diện quản lý danh mục sản phẩm
- [ ] Cập nhật schema sản phẩm để hỗ trợ biến thể tốt hơn
- [ ] Tạo API endpoints cho quản lý biến thể sản phẩm
- [ ] Phát triển giao diện quản lý biến thể sản phẩm
- [ ] Cập nhật form tạo/chỉnh sửa sản phẩm để hỗ trợ biến thể

### Tuần 4: Quản lý khuyến mãi và hình ảnh sản phẩm
- [ ] Tạo model và migration cho bảng Promotions và Discounts trong Prisma schema
- [ ] Tạo CRUD API endpoints cho mã giảm giá và khuyến mãi
- [ ] Phát triển giao diện quản lý mã giảm giá
- [ ] Phát triển giao diện quản lý khuyến mãi theo sản phẩm/danh mục
- [ ] Nâng cấp quản lý hình ảnh sản phẩm (tải lên nhiều ảnh, sắp xếp)
- [ ] Tích hợp chức năng nhập/xuất danh sách sản phẩm (CSV, Excel)
- [ ] Thêm chức năng sao chép sản phẩm

## Giai đoạn 3: Quản lý người dùng nâng cao (1 tuần)

### Tuần 5: Quản lý người dùng và quyền hạn
- [ ] Cập nhật API endpoints cho quản lý người dùng (thêm/xóa)
- [ ] Tạo API endpoint xem lịch sử đơn hàng của người dùng
- [ ] Tạo API endpoint khóa/mở khóa tài khoản người dùng
- [ ] Phát triển giao diện quản lý thông tin chi tiết người dùng
- [ ] Thêm chức năng xem lịch sử đơn hàng của người dùng
- [ ] Thêm chức năng khóa/mở khóa tài khoản
- [ ] Phát triển hệ thống phân quyền chi tiết hơn

## Giai đoạn 4: Báo cáo và phân tích (2 tuần)

### Tuần 6: Báo cáo doanh thu và tồn kho
- [ ] Tạo API endpoints cho báo cáo doanh thu (theo ngày, tuần, tháng, năm)
- [ ] Tạo API endpoints cho báo cáo tồn kho
- [ ] Phát triển giao diện báo cáo doanh thu với biểu đồ và bảng số liệu
- [ ] Phát triển giao diện báo cáo tồn kho
- [ ] Thêm chức năng xuất báo cáo doanh thu (PDF, Excel)
- [ ] Thêm chức năng cảnh báo hàng sắp hết

### Tuần 7: Phân tích dữ liệu và dự báo
- [ ] Tạo API endpoints cho phân tích hành vi người dùng
- [ ] Tạo API endpoints cho dự báo xu hướng bán hàng
- [ ] Phát triển giao diện phân tích hành vi người dùng
- [ ] Phát triển giao diện dự báo xu hướng bán hàng
- [ ] Tích hợp thuật toán dự báo đơn giản

## Giai đoạn 5: Tối ưu hóa và kiểm thử (1 tuần)

### Tuần 8: Kiểm thử và tối ưu hóa
- [ ] Viết unit tests cho các API endpoints mới
- [ ] Viết integration tests cho các chức năng quan trọng
- [ ] Tối ưu hóa hiệu suất backend (caching, indexing)
- [ ] Tối ưu hóa hiệu suất frontend (lazy loading, code splitting)
- [ ] Kiểm tra bảo mật (authentication, authorization)
- [ ] Kiểm tra khả năng mở rộng và xử lý tải
- [ ] Tạo tài liệu API và hướng dẫn sử dụng

## Chi tiết kỹ thuật

### Backend (NestJS + Prisma)

#### Cập nhật Schema Prisma
```prisma
// Thêm model Category
model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  parentId  String?
  parent    Category? @relation("CategoryToCategory", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryToCategory")
  products  Product[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Cập nhật model Product
model Product {
  // Các trường hiện có
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])
  variants   ProductVariant[]
  promotions ProductPromotion[]
}

// Thêm model ProductVariant
model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku       String   @unique
  options   Json     // {color: "Red", size: "XL"}
  price     Float
  stock     Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Thêm model Promotion
model Promotion {
  id          String   @id @default(cuid())
  code        String   @unique
  description String?
  discountType String  // PERCENTAGE, FIXED_AMOUNT
  discountValue Float
  minPurchase Float?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  products    ProductPromotion[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Thêm model ProductPromotion
model ProductPromotion {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  promotionId String
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([productId, promotionId])
}
```

### Frontend (React + TypeScript)

#### Cấu trúc thư mục mới
```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   ├── StatsOverview.tsx
│   │   │   │   ├── TopProductsList.tsx
│   │   │   │   └── RecentOrdersList.tsx
│   │   │   ├── orders/
│   │   │   │   ├── OrderStatusUpdate.tsx
│   │   │   │   └── OrderFilters.tsx
│   │   │   ├── products/
│   │   │   │   ├── CategoryForm.tsx
│   │   │   │   ├── CategoriesList.tsx
│   │   │   │   ├── ProductVariantsForm.tsx
│   │   │   │   └── ProductImagesManager.tsx
│   │   │   ├── promotions/
│   │   │   │   ├── PromotionForm.tsx
│   │   │   │   └── PromotionsList.tsx
│   │   │   └── reports/
│   │   │       ├── RevenueReport.tsx
│   │   │       └── InventoryReport.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── categories/
│   │   │   │   ├── AdminCategoriesListPage.tsx
│   │   │   │   ├── AdminCategoryCreatePage.tsx
│   │   │   │   └── AdminCategoryEditPage.tsx
│   │   │   ├── promotions/
│   │   │   │   ├── AdminPromotionsListPage.tsx
│   │   │   │   ├── AdminPromotionCreatePage.tsx
│   │   │   │   └── AdminPromotionEditPage.tsx
│   │   │   ├── reports/
│   │   │   │   ├── AdminRevenueReportPage.tsx
│   │   │   │   └── AdminInventoryReportPage.tsx
│   ├── services/
│   │   ├── adminCategoryApiService.ts
│   │   ├── adminPromotionApiService.ts
│   │   ├── adminReportApiService.ts
│   │   └── adminDashboardApiService.ts
```

## Tài nguyên cần thiết

### Thư viện và công cụ
- Chart.js hoặc Recharts cho biểu đồ
- React Hook Form cho quản lý form
- React Query cho quản lý state server
- ExcelJS hoặc SheetJS để xuất Excel
- jsPDF để xuất PDF
- Nodemailer cho gửi email
- Multer cho upload file
- Jest cho testing

### Tài liệu tham khảo
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## Người thực hiện
- Frontend Developer: [Tên]
- Backend Developer: [Tên]
- UX/UI Designer: [Tên]
- Project Manager: [Tên]

## Theo dõi tiến độ
- Ngày bắt đầu: [Ngày]
- Ngày dự kiến hoàn thành: [Ngày + 8 tuần]
- Công cụ quản lý: [Trello/Jira/GitHub Projects] 