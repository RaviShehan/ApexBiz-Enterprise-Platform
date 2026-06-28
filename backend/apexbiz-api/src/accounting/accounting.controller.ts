import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AccountingService } from './accounting.service';

@Controller('accounting')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('trial-balance')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getTrialBalance() {
    return this.accountingService.getTrialBalance();
  }

  @Get('income-statement')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getIncomeStatement() {
    return this.accountingService.getIncomeStatement();
  }

  @Get('balance-sheet')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getBalanceSheet() {
    return this.accountingService.getBalanceSheet();
  }

  @Get('wallet-summary')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getWalletSummary() {
    return this.accountingService.getWalletSummary();
  }

  @Get('ledger-summary')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getLedgerSummary() {
    return this.accountingService.getLedgerSummary();
  }
}
