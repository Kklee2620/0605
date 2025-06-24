import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales')
  async getSalesData(
    @Query('period') period: string = 'month',
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.dashboardService.getSalesData(period, start, end);
  }

  @Get('top-products')
  async getTopProducts(
    @Query('limit') limit: number = 5,
    @Query('period') period: string = 'month',
  ) {
    return this.dashboardService.getTopProducts(limit, period);
  }

  @Get('recent-orders')
  async getRecentOrders(
    @Query('limit') limit: number = 5,
  ) {
    return this.dashboardService.getRecentOrders(limit);
  }
} 