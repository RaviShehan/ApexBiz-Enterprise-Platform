import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CurrentDatabaseResult = {
  current_database: string;
};

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getDatabaseHealth() {
    const result = await this.prisma.$queryRaw<CurrentDatabaseResult[]>`
      SELECT current_database();
    `;

    return {
      status: 'connected',
      database: result[0]?.current_database ?? 'unknown',
      message: 'PostgreSQL database connection is working',
    };
  }
}
