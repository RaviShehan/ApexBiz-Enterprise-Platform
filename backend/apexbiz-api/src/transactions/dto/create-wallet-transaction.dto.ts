import { WalletTransactionType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateWalletTransactionDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsEnum(WalletTransactionType)
  type!: WalletTransactionType;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsOptional()
  @IsString()
  sourceWalletId?: string;

  @IsOptional()
  @IsString()
  destinationWalletId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
