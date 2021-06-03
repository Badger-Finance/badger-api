import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChainNetwork } from '../../chains/enums/chain-network.enum';

export class ChartsQueryDto {
  @IsString()
  readonly id!: string;

  @IsEnum(ChainNetwork)
  @IsOptional()
  readonly chain?: ChainNetwork;
}
