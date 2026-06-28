import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokensController } from './refresh-tokens.controller';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'apexbiz-dev-secret',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService],
})
export class RefreshTokensModule {}
