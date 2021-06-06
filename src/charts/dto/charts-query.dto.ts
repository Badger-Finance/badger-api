import { Transform } from 'class-transformer';
import { IsEnum, IsEthereumAddress, IsInt, IsISO8601, IsOptional, IsPositive, ValidateIf } from 'class-validator';
import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { ChartGranularity } from '../enums/chart-granularity.enum';

export class ChartsQueryDto {
  @IsEthereumAddress()
  readonly id!: string;

  @IsEnum(ChainNetwork)
  @IsOptional()
  readonly chain?: ChainNetwork;

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
