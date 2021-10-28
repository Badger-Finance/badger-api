import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SettHarvest_OrderBy, OrderDirection } from '../../graphql/generated/badger';

export class HarvestsQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  first?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsEnum(SettHarvest_OrderBy)
  orderBy?: SettHarvest_OrderBy;

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
}
