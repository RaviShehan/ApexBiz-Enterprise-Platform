import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
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

  async verifyHashChain() {
    const auditLogs = await this.prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    let expectedPreviousHash: string | null = null;

    for (const log of auditLogs) {
      const auditData = {
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        method: log.method,
        path: log.path,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        statusCode: log.statusCode,
        metadata: log.metadata,
        previousHash: log.previousHash,
      };

      const expectedCurrentHash = this.createAuditHash(auditData);

      if (log.previousHash !== expectedPreviousHash) {
        return {
          valid: false,
          message: 'Audit hash chain is broken at previousHash check',
          brokenAuditLogId: log.id,
        };
      }

      if (log.currentHash !== expectedCurrentHash) {
        return {
          valid: false,
          message: 'Audit hash chain is broken at currentHash check',
          brokenAuditLogId: log.id,
        };
      }

      expectedPreviousHash = log.currentHash;
    }

    return {
      valid: true,
      message: 'Audit hash chain is valid',
      totalAuditLogsChecked: auditLogs.length,
    };
  }

  private createAuditHash(data: Record<string, unknown>) {
    return createHash('sha256')
      .update(this.stableStringify(data))
      .digest('hex');
  }

  private stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }

    const objectValue = value as Record<string, unknown>;
    const sortedKeys = Object.keys(objectValue).sort();

    return `{${sortedKeys
      .map((key) => `${JSON.stringify(key)}:${this.stableStringify(objectValue[key])}`)
      .join(',')}}`;
  }
}
