import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { StockInDto } from './dto/stock-in.dto';
import { StockOutDto } from './dto/stock-out.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('stock-in')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  stockIn(@Body() stockInDto: StockInDto) {
    return this.inventoryService.stockIn(stockInDto);
  }

  @Post('stock-out')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  stockOut(@Body() stockOutDto: StockOutDto) {
    return this.inventoryService.stockOut(stockOutDto);
  }

  @Post('adjust')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  adjustStock(@Body() adjustStockDto: AdjustStockDto) {
    return this.inventoryService.adjustStock(adjustStockDto);
  }

  @Get('movements')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findAllMovements() {
    return this.inventoryService.findAllMovements();
  }

  @Get('product/:productId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findMovementsByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findMovementsByProduct(productId);
  }
}
