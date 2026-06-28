import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorLastVerifiedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async requestOtp(userId: string) {
    const otp = randomInt(100000, 999999).toString();
    const otpHash = this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorEnabled: true,
        twoFactorOtpHash: otpHash,
        twoFactorOtpExpiresAt: expiresAt,
      },
      select: {
        id: true,
        username: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    return {
      message: 'OTP generated successfully',
      user,
      expiresAt,
      devOtp: otp,
      note: 'In production, this OTP should be sent using email or SMS. The plain OTP should not be returned in the API response.',
    };
  }

  async verifyOtp(userId: string, otp: string) {
    if (!otp) {
      throw new BadRequestException('OTP is required');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.twoFactorOtpHash || !user.twoFactorOtpExpiresAt) {
      throw new BadRequestException('No active OTP request found');
    }

    if (user.twoFactorOtpExpiresAt < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }

    const otpHash = this.hashOtp(otp);

    if (otpHash !== user.twoFactorOtpHash) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorEnabled: true,
        twoFactorOtpHash: null,
        twoFactorOtpExpiresAt: null,
        twoFactorLastVerifiedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorLastVerifiedAt: true,
      },
    });

    return {
      message: 'OTP verified successfully',
      user: updatedUser,
    };
  }

  async disableTwoFactor(userId: string) {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFactorEnabled: false,
        twoFactorOtpHash: null,
        twoFactorOtpExpiresAt: null,
        twoFactorLastVerifiedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        twoFactorEnabled: true,
      },
    });

    return {
      message: 'Two-factor authentication disabled successfully',
      user: updatedUser,
    };
  }

  private hashOtp(otp: string) {
    return createHash('sha256').update(otp).digest('hex');
  }
}
