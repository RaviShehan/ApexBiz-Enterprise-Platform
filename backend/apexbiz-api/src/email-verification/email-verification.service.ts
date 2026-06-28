import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getVerificationStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async requestEmailVerification(userId: string) {
    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
      },
    });

    return {
      message: 'Email verification token generated successfully',
      user,
      expiresAt,
      devVerificationToken: token,
      devVerificationUrl: `http://localhost:3000/email-verification/verify?token=${token}`,
      note: 'In production, this token should be sent by email using an email service.',
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const tokenHash = this.hashToken(token);

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
      },
    });

    return {
      message: 'Email verified successfully',
      user: updatedUser,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
