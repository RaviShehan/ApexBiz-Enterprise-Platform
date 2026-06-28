import { Controller, Get, UseGuards } from '@nestjs/common';
import { MlInsightsService } from './ml-insights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ml-insights')
@UseGuards(JwtAuthGuard)
export class MlInsightsController {
  constructor(private readonly mlInsightsService: MlInsightsService) {}

  @Get('business-insights')
  getBusinessInsights() {
    return this.mlInsightsService.getBusinessInsights();
  }
}

