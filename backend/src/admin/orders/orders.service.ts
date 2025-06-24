import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AdminOrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date,
    minAmount?: number,
    maxAmount?: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện tìm kiếm
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }
    
    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) {
        where.totalAmount.gte = minAmount;
      }
      if (maxAmount) {
        where.totalAmount.lte = maxAmount;
      }
    }
    
    if (search) {
      where.OR = [
        {
          user: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Truy vấn đơn hàng
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
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
      }),
      this.prisma.order.count({ where }),
    ]);

    // Chuyển đổi dữ liệu để phù hợp với frontend
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.orderItems, // Đổi tên từ orderItems sang items cho frontend
      orderItems: undefined, // Loại bỏ orderItems
    }));

    return {
      data: formattedOrders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
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
                description: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Chuyển đổi dữ liệu để phù hợp với frontend
    const formattedOrder = {
      ...order,
      items: order.orderItems, // Đổi tên từ orderItems sang items cho frontend
      orderItems: undefined, // Loại bỏ orderItems
    };

    return formattedOrder;
  }

  async updateStatus(id: string, status: OrderStatus, sendEmail: boolean = false) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
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
              },
            },
          },
        },
      },
    });

    // Chuyển đổi dữ liệu để phù hợp với frontend
    const formattedOrder = {
      ...order,
      items: order.orderItems, // Đổi tên từ orderItems sang items cho frontend
      orderItems: undefined, // Loại bỏ orderItems
    };

    if (sendEmail && formattedOrder.user?.email) {
      await this.sendStatusUpdateEmail(formattedOrder);
    }

    return formattedOrder;
  }

  async exportOrders(
    format: 'pdf' | 'excel',
    status?: OrderStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Buffer> {
    // Xây dựng điều kiện tìm kiếm
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    // Truy vấn đơn hàng
    const orders = await this.prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: true,
      },
    });

    // Chuyển đổi dữ liệu để phù hợp với frontend
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.orderItems, // Đổi tên từ orderItems sang items cho frontend
      orderItems: undefined, // Loại bỏ orderItems
    }));

    // Tạo báo cáo theo định dạng yêu cầu
    if (format === 'excel') {
      return this.generateExcelReport(formattedOrders);
    } else {
      return this.generatePdfReport(formattedOrders);
    }
  }

  private async generateExcelReport(orders: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    // Thiết lập tiêu đề cột
    worksheet.columns = [
      { header: 'Order ID', key: 'id', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Total Amount', key: 'total', width: 15 },
      { header: 'Items', key: 'items', width: 40 },
    ];

    // Thêm dữ liệu
    orders.forEach((order) => {
      const itemsText = order.items
        ? order.items.map((item) => `${item.quantity}x ${item.product?.name || 'Unknown Product'}`).join(', ')
        : '';

      worksheet.addRow({
        id: order.id,
        date: new Date(order.createdAt).toLocaleDateString(),
        customer: `${order.user?.firstName || ''} ${order.user?.lastName || ''} (${order.user?.email || 'No email'})`,
        status: this.translateOrderStatus(order.status),
        total: `${order.totalAmount.toLocaleString()} VND`,
        items: itemsText,
      });
    });

    // Tạo buffer
    return await workbook.xlsx.writeBuffer() as unknown as Buffer;
  }

  private async generatePdfReport(orders: any[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50 });

      // Ghi dữ liệu vào buffer
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Tiêu đề báo cáo
      doc.fontSize(20).text('Orders Report', { align: 'center' });
      doc.moveDown();

      // Thông tin báo cáo
      doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
      doc.moveDown();

      // Danh sách đơn hàng
      orders.forEach((order, index) => {
        if (index > 0) {
          doc.addPage();
        }

        doc.fontSize(16).text(`Order #${order.id}`);
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.text(`Customer: ${order.user?.firstName || ''} ${order.user?.lastName || ''}`);
        doc.text(`Email: ${order.user?.email || 'No email'}`);
        doc.text(`Status: ${this.translateOrderStatus(order.status)}`);
        doc.text(`Total Amount: ${order.totalAmount.toLocaleString()} VND`);
        doc.moveDown();

        // Danh sách sản phẩm
        if (order.items && order.items.length > 0) {
          doc.text('Items:');
          order.items.forEach((item) => {
            doc.text(`- ${item.quantity}x ${item.product?.name || 'Unknown Product'} (${item.price.toLocaleString()} VND)`);
          });
        }
      });

      doc.end();
    });
  }

  private translateOrderStatus(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Chờ xử lý';
      case OrderStatus.CONFIRMED:
        return 'Đã xác nhận';
      case OrderStatus.SHIPPED:
        return 'Đang giao hàng';
      case OrderStatus.DELIVERED:
        return 'Đã giao hàng';
      case OrderStatus.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  private async sendStatusUpdateEmail(order: any) {
    // Tạo transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASS || 'password',
      },
    });

    // Chuẩn bị nội dung email
    const statusText = this.translateOrderStatus(order.status);
    const itemsList = order.items
      ? order.items.map((item) => `${item.quantity}x ${item.product?.name || 'Sản phẩm'}`).join('<br>')
      : '';

    // Gửi email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Modern Store" <noreply@modernstore.com>',
        to: order.user.email,
        subject: `Cập nhật đơn hàng #${order.id}`,
        html: `
          <h2>Xin chào ${order.user.firstName || 'Quý khách'},</h2>
          <p>Đơn hàng #${order.id} của bạn đã được cập nhật sang trạng thái: <strong>${statusText}</strong></p>
          
          <h3>Thông tin đơn hàng:</h3>
          <p>
            <strong>Ngày đặt hàng:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br>
            <strong>Tổng tiền:</strong> ${order.totalAmount.toLocaleString()} VND
          </p>
          
          <h3>Sản phẩm:</h3>
          <p>${itemsList}</p>
          
          <p>Cảm ơn bạn đã mua sắm tại Modern Store!</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
} 