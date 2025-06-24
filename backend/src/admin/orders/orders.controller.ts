import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Body, 
  Query, 
  UseGuards,
  Res,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { AdminOrdersService } from './orders.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Response } from 'express';
import { OrderStatus } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOrdersController {
  constructor(private readonly ordersService: AdminOrdersService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('search') search?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    let minAmountNum: number | undefined;
    let maxAmountNum: number | undefined;

    if (minAmount) {
      minAmountNum = parseFloat(minAmount);
      if (isNaN(minAmountNum)) {
        throw new BadRequestException('Invalid minAmount parameter');
      }
    }

    if (maxAmount) {
      maxAmountNum = parseFloat(maxAmount);
      if (isNaN(maxAmountNum)) {
        throw new BadRequestException('Invalid maxAmount parameter');
      }
    }

    return this.ordersService.findAll(
      pageNumber,
      limitNumber,
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      minAmountNum,
      maxAmountNum,
      search,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Body('sendEmail') sendEmail: boolean = false,
  ) {
    const order = await this.ordersService.updateStatus(id, status, sendEmail);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Get('export')
  async exportOrders(
    @Res() res: Response,
    @Query('format') format: 'pdf' | 'excel' = 'excel',
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const buffer = await this.ordersService.exportOrders(
      format,
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );

    const filename = `orders-export-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'pdf') {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}.pdf`,
        'Content-Length': buffer.length,
      });
    } else {
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${filename}.xlsx`,
        'Content-Length': buffer.length,
      });
    }

    res.end(buffer);
  }
} 