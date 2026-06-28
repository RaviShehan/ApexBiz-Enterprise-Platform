import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

class RequestPasswordResetDto {
  username?: string;
  email?: string;
}

class ResetPasswordDto {
  token!: string;
  newPassword!: string;
}

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request')
  requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.passwordResetService.requestPasswordReset(body);
  }

  @Post('confirm')
  confirmPasswordReset(@Body() body: ResetPasswordDto) {
    return this.passwordResetService.confirmPasswordReset(body);
  }
}
