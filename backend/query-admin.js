const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Querying admin information...');
    
    // Tìm người dùng có vai trò ADMIN
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      include: {
        orders: true,
        reviews: true
      }
    });
    
    console.log('Admin information:');
    console.log(JSON.stringify({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      ordersCount: admin.orders.length,
      reviewsCount: admin.reviews.length
    }, null, 2));
    
    // Kiểm tra quyền hạn của admin
    console.log('\nAdmin permissions:');
    console.log('- Quản lý sản phẩm (thêm, sửa, xóa)');
    console.log('- Quản lý người dùng (xem, sửa, xóa)');
    console.log('- Quản lý đơn hàng');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 