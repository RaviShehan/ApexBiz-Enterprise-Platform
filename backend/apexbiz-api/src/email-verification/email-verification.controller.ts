import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('status')
  @UseGuards(JwtAuthGuard)
  getVerificationStatus(@Request() request: any) {
    return this.emailVerificationService.getVerificationStatus(request.user.id);
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  requestEmailVerification(@Request() request: any) {
    return this.emailVerificationService.requestEmailVerification(request.user.id);
  }

  @Get('verify')
  verifyEmail(@Query('token') token: string) {
    return this.emailVerificationService.verifyEmail(token);
  }
}

