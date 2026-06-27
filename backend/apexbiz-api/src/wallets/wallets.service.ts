import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WalletType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletStatusDto } from './dto/update-wallet-status.dto';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWalletDto: CreateWalletDto) {
    const existingWallet = await this.prisma.wallet.findUnique({
      where: {
        walletCode: createWalletDto.walletCode,
      },
    });

    if (existingWallet) {
      throw new BadRequestException('Wallet code already exists');
    }

    if (createWalletDto.type === WalletType.BUSINESS) {
      if (!createWalletDto.businessId) {
        throw new BadRequestException('businessId is required for BUSINESS wallet');
      }

      const business = await this.prisma.business.findUnique({
        where: {
          id: createWalletDto.businessId,
        },
      });

      if (!business) {
        throw new NotFoundException('Business not found');
      }
    }

    if (createWalletDto.type === WalletType.BRANCH) {
      if (!createWalletDto.branchId) {
        throw new BadRequestException('branchId is required for BRANCH wallet');
      }

      const branch = await this.prisma.branch.findUnique({
        where: {
          id: createWalletDto.branchId,
        },
      });

      if (!branch) {
        throw new NotFoundException('Branch not found');
      }
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        walletCode: createWalletDto.walletCode,
        type: createWalletDto.type,
        businessId: createWalletDto.businessId,
        branchId: createWalletDto.branchId,
        currency: createWalletDto.currency ?? 'LKR',
      },
      include: {
        business: true,
        branch: true,
      },
    });

    return {
      message: 'Wallet created successfully',
      wallet,
    };
  }

  async findAll() {
    return this.prisma.wallet.findMany({
      include: {
        business: true,
        branch: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: {
        business: true,
        branch: true,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async updateStatus(id: string, updateWalletStatusDto: UpdateWalletStatusDto) {
    await this.findOne(id);

    const wallet = await this.prisma.wallet.update({
      where: { id },
      data: {
        status: updateWalletStatusDto.status,
      },
      include: {
        business: true,
        branch: true,
      },
    });

    return {
      message: 'Wallet status updated successfully',
      wallet,
    };
  }
}
