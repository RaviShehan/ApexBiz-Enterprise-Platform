import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

type RequestPasswordResetInput = {
  username?: string;
  email?: string;
};

type ConfirmPasswordResetInput = {
  token: string;
  newPassword: string;
};

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters.');
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter.');
    }

    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter.');
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number.');
    }
  }

  async requestPasswordReset(input: RequestPasswordResetInput) {
    const username = input.username?.trim();
    const email = input.email?.trim();

    if (!username && !email) {
      throw new BadRequestException('Username or email is required.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          username ? { username } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as any,
      },
    });

    const safeResponse = {
      message:
        'If the account exists, a password reset email has been sent.',
    };

    if (!user || !user.email) {
      return safeResponse;
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = this.hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await this.emailService.sendMail({
      to: user.email,
      subject: 'ApexBiz Password Reset',
      text:
        `You requested a password reset for ApexBiz.\n\n` +
        `Reset link: ${resetUrl}\n\n` +
        `This link expires in 15 minutes. If you did not request this, ignore this email.`,
      html:
        `<p>You requested a password reset for ApexBiz.</p>` +
        `<p><a href="${resetUrl}">Reset your password</a></p>` +
        `<p>This link expires in 15 minutes. If you did not request this, ignore this email.</p>`,
    });

    if (process.env.NODE_ENV !== 'production') {
      return {
        ...safeResponse,
        devResetToken: resetToken,
        devResetUrl: resetUrl,
      };
    }

    return safeResponse;
  }

  async confirmPasswordReset(input: ConfirmPasswordResetInput) {
    const token = input.token?.trim();

    if (!token) {
      throw new BadRequestException('Reset token is required.');
    }

    this.validatePassword(input.newPassword);

    const tokenHash = this.hashToken(token);

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        passwordResetTokenExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: passwordHash,
        passwordResetTokenHash: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    return {
      message: 'Password reset successful.',
    };
  }
}
