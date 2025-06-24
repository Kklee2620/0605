import { Module } from '@nestjs/common';
import { AdminDashboardController } from './dashboard/dashboard.controller';
import { AdminDashboardService } from './dashboard/dashboard.service';
import { AdminOrdersController } from './orders/orders.controller';
import { AdminOrdersService } from './orders/orders.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminDashboardController, AdminOrdersController],
  providers: [AdminDashboardService, AdminOrdersService],
})
export class AdminModule {} 