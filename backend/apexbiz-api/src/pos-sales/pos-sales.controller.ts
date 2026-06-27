import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePosSaleDto } from './dto/create-pos-sale.dto';
import { PosSalesService } from './pos-sales.service';

@Controller('pos-sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PosSalesController {
  constructor(private readonly posSalesService: PosSalesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  create(@Body() createPosSaleDto: CreatePosSaleDto) {
    return this.posSalesService.create(createPosSaleDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findAll() {
    return this.posSalesService.findAll();
  }

  @Get('business/:businessId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findByBusiness(@Param('businessId') businessId: string) {
    return this.posSalesService.findByBusiness(businessId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findOne(@Param('id') id: string) {
    return this.posSalesService.findOne(id);
  }
}
