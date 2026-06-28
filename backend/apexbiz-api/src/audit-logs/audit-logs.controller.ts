import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.auditLogsService.findAll(Number(limit) || 100);
  }

  @Get('verify-chain')
  verifyHashChain() {
    return this.auditLogsService.verifyHashChain();
  }

  @Get('entity')
  findByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.auditLogsService.findByEntity(entityType, entityId);
  }
}


