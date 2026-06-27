import { WalletType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  walletCode!: string;

  @IsEnum(WalletType)
  type!: WalletType;

  @IsOptional()
  @IsString()
  businessId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
