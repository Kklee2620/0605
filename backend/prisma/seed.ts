import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Tạo người dùng admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });
  console.log('Created admin user:', admin.email);

  // Tạo người dùng thông thường
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
    },
  });
  console.log('Created regular user:', user.email);

  // Define canonical product categories (aligned with frontend/src/types.ts)
  const categories: string[] = ['Furniture', 'Lighting', 'Home Decor', 'Appliances', 'Electronics', 'Apparel', 'Books', 'Kitchenware'];

  // Tạo các sản phẩm mẫu
  for (let i = 1; i <= 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const product = await prisma.product.create({
      data: {
        name: `Product ${i}`,
        description: `This is a sample product ${i} in the ${category} category.`,
        price: parseFloat((10 + Math.random() * 90).toFixed(2)),
        imageUrl: `https://picsum.photos/seed/${i}/500/500`,
        category,
        stock: Math.floor(Math.random() * 100) + 1,
      },
    });
    console.log('Created product:', product.name);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 