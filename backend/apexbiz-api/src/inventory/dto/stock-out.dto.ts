import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class StockOutDto {
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
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
