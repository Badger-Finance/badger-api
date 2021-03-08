import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Harvest_OrderBy, OrderDirection } from '../../graphql/generated/badger-dao';

export class HarvestsQueryArgs {
	@IsOptional()
	@IsInt()
	@Min(0)
	first?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	skip?: number;

	@IsOptional()
	@IsEnum(Harvest_OrderBy)
	orderBy?: Harvest_OrderBy;

	@IsOptional()
	@IsEnum(OrderDirection)
	orderDirection?: OrderDirection;
}
