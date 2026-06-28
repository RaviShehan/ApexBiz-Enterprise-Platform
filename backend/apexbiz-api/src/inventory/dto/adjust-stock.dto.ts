import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class AdjustStockDto {
  @IsOptional()
  @IsString()
  reference?: string;

  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  businessId!: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsString()
  @IsNotEmpty()
  createdById!: string;

  @IsInt()
  @Min(0)
  newStockQuantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
