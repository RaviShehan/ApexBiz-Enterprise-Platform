import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MlInsightsController } from './ml-insights.controller';
import { MlInsightsService } from './ml-insights.service';

@Module({
  imports: [PrismaModule],
  controllers: [MlInsightsController],
  providers: [MlInsightsService],
})
export class MlInsightsModule {}
