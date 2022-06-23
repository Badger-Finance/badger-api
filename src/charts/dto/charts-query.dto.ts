import { Network } from '@badger-dao/sdk';
import { Transform } from 'class-transformer';
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsOptional, IsPositive, ValidateIf } from 'class-validator';

import { ChartGranularity } from '../enums/chart-granularity.enum';

export class ChartsQueryDto {
  @IsEthereumAddress()
  readonly id!: string;

  @IsEnum(Network)
  @IsOptional()
  readonly chain?: Network;

  @ValidateIf((o: ChartsQueryDto) => Boolean(o.end))
  @IsISO8601()
  readonly start?: Date;

  @ValidateIf((o: ChartsQueryDto) => Boolean(o.start))
  @IsISO8601()
  readonly end?: Date;

  @IsEnum(ChartGranularity)
  @IsOptional()
  readonly granularity?: ChartGranularity;

  @IsPositive()
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  readonly period?: number;
}
