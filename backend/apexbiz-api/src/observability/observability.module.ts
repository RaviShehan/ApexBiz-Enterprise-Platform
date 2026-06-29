import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ObservabilityController } from './observability.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ObservabilityController],
})
export class ObservabilityModule {}
