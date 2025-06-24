import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      pendingOrders,
    ] = await Promise.all([
      // Tổng số sản phẩm
      this.prisma.product.count({
        where: { isActive: true },
      }),
      // Tổng số người dùng
      this.prisma.user.count({
        where: { role: 'USER' },
      }),
      // Tổng số đơn hàng
      this.prisma.order.count(),
      // Tổng doanh thu
      this.prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: {
            in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED],
          },
        },
      }),
      // Sản phẩm sắp hết hàng
      this.prisma.product.count({
        where: {
          stock: {
            lte: 5,
          },
          isActive: true,
        },
      }),
      // Đơn hàng đang chờ xử lý
      this.prisma.order.count({
        where: {
          status: OrderStatus.PENDING,
        },
      }),
    ]);

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      lowStockProducts,
      pendingOrders,
    };
  }

  async getSalesData(period: string, start?: string, end?: string) {
    const currentDate = new Date();
    let startDate: Date;
    let endDate = new Date(currentDate);
    let interval: 'day' | 'week' | 'month' = 'day';

    // Xác định khoảng thời gian dựa trên period
    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      switch (period) {
        case 'week':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          interval = 'day';
          break;
        case 'month':
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
          interval = 'day';
          break;
        case 'year':
          startDate = new Date(currentDate);
          startDate.setFullYear(currentDate.getFullYear() - 1);
          interval = 'month';
          break;
        default:
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          interval = 'day';
      }
    }

    // Lấy dữ liệu đơn hàng trong khoảng thời gian
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Tạo dữ liệu theo khoảng thời gian
    const salesData = this.groupSalesByInterval(orders, startDate, endDate, interval);
    
    return {
      data: salesData,
      period,
      interval,
      startDate,
      endDate,
    };
  }

  private groupSalesByInterval(
    orders: { id: string; totalAmount: number; createdAt: Date }[],
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month',
  ): { date: string; sales: number; orders: number }[] {
    const result: { date: string; sales: number; orders: number }[] = [];
    const dateMap = new Map<string, { date: Date; sales: number; orders: number }>();

    // Khởi tạo tất cả các ngày/tháng trong khoảng thời gian với doanh số 0
    let current = new Date(startDate);
    while (current <= endDate) {
      const key = this.getIntervalKey(current, interval);
      dateMap.set(key, { date: new Date(current), sales: 0, orders: 0 });

      // Tăng ngày/tháng tùy theo interval
      if (interval === 'day') {
        current = new Date(current.setDate(current.getDate() + 1));
      } else if (interval === 'month') {
        current = new Date(current.setMonth(current.getMonth() + 1));
      } else if (interval === 'week') {
        current = new Date(current.setDate(current.getDate() + 7));
      }
    }

    // Cộng dồn doanh số theo ngày/tháng
    for (const order of orders) {
      const key = this.getIntervalKey(order.createdAt, interval);
      if (dateMap.has(key)) {
        const data = dateMap.get(key)!;
        data.sales += order.totalAmount;
        data.orders += 1;
      }
    }

    // Chuyển từ Map sang mảng để trả về
    dateMap.forEach((value, key) => {
      result.push({
        date: key,
        sales: value.sales,
        orders: value.orders,
      });
    });

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private getIntervalKey(date: Date, interval: 'day' | 'week' | 'month'): string {
    if (interval === 'day') {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (interval === 'month') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    } else if (interval === 'week') {
      const firstDayOfWeek = new Date(date);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh nếu là Chủ Nhật
      firstDayOfWeek.setDate(diff);
      return firstDayOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD của ngày đầu tuần
    }
    return date.toISOString().split('T')[0];
  }

  async getTopProducts(limit: number = 5, period: string = 'month') {
    const currentDate = new Date();
    let startDate: Date;

    // Xác định khoảng thời gian dựa trên period
    switch (period) {
      case 'week':
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(currentDate);
        startDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 1);
    }

    // Lấy sản phẩm bán chạy nhất trong khoảng thời gian
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          createdAt: {
            gte: startDate,
          },
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Lấy thông tin chi tiết của các sản phẩm
    const productIds = topProducts.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: true,
        stock: true,
      },
    });

    // Kết hợp thông tin sản phẩm với số lượng đã bán
    return topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...product,
        imageUrls: product?.imageUrl ? [product.imageUrl] : [], // Chuyển đổi imageUrl thành imageUrls cho frontend
        totalSold: item._sum.quantity,
      };
    });
  }

  async getRecentOrders(limit: number = 5) {
    const orders = await this.prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Chuyển đổi dữ liệu để phù hợp với frontend
    return orders.map(order => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      user: order.user,
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
          imageUrls: item.product.imageUrl ? [item.product.imageUrl] : [],
        },
      })),
    }));
  }
} 