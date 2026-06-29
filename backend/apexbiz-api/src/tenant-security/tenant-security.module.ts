import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantSecurityService } from './tenant-security.service';

@Module({
  imports: [PrismaModule],
  providers: [TenantSecurityService],
  exports: [TenantSecurityService],
})
export class TenantSecurityModule {}
