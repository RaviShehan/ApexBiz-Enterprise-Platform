import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLedgerEntryDto {
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @IsInt()
  @Min(0)
  debitCents!: number;

  @IsInt()
  @Min(0)
  creditCents!: number;

  @IsOptional()
  @IsString()
  memo?: string;
}

export class CreateLedgerTransactionDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateLedgerEntryDto)
  entries!: CreateLedgerEntryDto[];
}
