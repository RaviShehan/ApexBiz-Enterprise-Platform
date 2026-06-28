import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('two-factor')
@UseGuards(JwtAuthGuard)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Get('status')
  getStatus(@Request() request: any) {
    return this.twoFactorService.getStatus(request.user.id);
  }

  @Post('request-otp')
  requestOtp(@Request() request: any) {
    return this.twoFactorService.requestOtp(request.user.id);
  }

  @Post('verify-otp')
  verifyOtp(@Request() request: any, @Body('otp') otp: string) {
    return this.twoFactorService.verifyOtp(request.user.id, otp);
  }

  @Post('disable')
  disableTwoFactor(@Request() request: any) {
    return this.twoFactorService.disableTwoFactor(request.user.id);
  }
}

