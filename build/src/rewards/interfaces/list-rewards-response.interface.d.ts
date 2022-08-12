import { DebankUser } from './debank-user.interface';
export interface ListRewardsResponse {
    total_count: number;
    total_page_num: number;
    users: DebankUser[];
}
