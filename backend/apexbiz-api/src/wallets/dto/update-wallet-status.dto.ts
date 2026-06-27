import { WalletStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateWalletStatusDto {
  @IsEnum(WalletStatus)
  status!: WalletStatus;
}
