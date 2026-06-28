import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('refresh-tokens')
export class RefreshTokensController {
  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createRefreshToken(@Request() request: any) {
    return this.refreshTokensService.createRefreshTokenForUser(request.user.id);
  }

  @Post('rotate')
  rotateRefreshToken(@Body('refreshToken') refreshToken: string) {
    return this.refreshTokensService.rotateRefreshToken(refreshToken);
  }

  @Post('revoke')
  revokeRefreshToken(@Body('refreshToken') refreshToken: string) {
    return this.refreshTokensService.revokeRefreshToken(refreshToken);
  }

  @Post('revoke-all')
  @UseGuards(JwtAuthGuard)
  revokeAllUserRefreshTokens(@Request() request: any) {
    return this.refreshTokensService.revokeAllUserRefreshTokens(request.user.id);
  }
}

