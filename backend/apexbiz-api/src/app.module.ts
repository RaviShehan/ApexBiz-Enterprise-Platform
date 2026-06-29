import { MlInsightsModule } from './ml-insights/ml-insights.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { TwoFactorModule } from './two-factor/two-factor.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { Module } from '@nestjs/common';
import { RedisCacheModule } from './cache/redis-cache.module';
import { ObservabilityModule } from './observability/observability.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { BusinessesModule } from './businesses/businesses.module';
import { DatabaseModule } from './database/database.module';
import { LedgerModule } from './ledger/ledger.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletsModule } from './wallets/wallets.module';
import { PosSalesModule } from './pos-sales/pos-sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { AccountingModule } from './accounting/accounting.module';

@Module({
  imports: [RedisCacheModule, ObservabilityModule, MlInsightsModule, RefreshTokensModule, TwoFactorModule, EmailVerificationModule, AuditLogsModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    DatabaseModule,
    AuthModule,
    BusinessesModule,
    BranchesModule,
    WalletsModule,
    LedgerModule,
    TransactionsModule,
    ProductsModule,
    PosSalesModule,
    InventoryModule,
    AccountingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}





