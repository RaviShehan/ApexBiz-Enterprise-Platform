import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateLedgerAccountDto } from './dto/create-ledger-account.dto';
import { CreateLedgerTransactionDto } from './dto/create-ledger-transaction.dto';
import { LedgerService } from './ledger.service';

@Controller('ledger')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('accounts')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  createAccount(@Body() createLedgerAccountDto: CreateLedgerAccountDto) {
    return this.ledgerService.createAccount(createLedgerAccountDto);
  }

  @Get('accounts')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findAllAccounts() {
    return this.ledgerService.findAllAccounts();
  }

  @Get('accounts/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findOneAccount(@Param('id') id: string) {
    return this.ledgerService.findOneAccount(id);
  }

  @Post('transactions')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  createTransaction(
    @Body() createLedgerTransactionDto: CreateLedgerTransactionDto,
  ) {
    return this.ledgerService.createTransaction(createLedgerTransactionDto);
  }

  @Get('transactions')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findAllTransactions() {
    return this.ledgerService.findAllTransactions();
  }

  @Get('transactions/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
  findOneTransaction(@Param('id') id: string) {
    return this.ledgerService.findOneTransaction(id);
  }
}
