import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit = 100) {
    const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);

    return this.prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: safeLimit,
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
