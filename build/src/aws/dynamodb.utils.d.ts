import { DataMapper } from "@aws/dynamodb-data-mapper";
import { Chain } from "../chains/config/chain.config";
import { Chainish } from "./interfaces/chainish.interface";
import { Vaultish } from "./interfaces/vaultish.interface";
export declare function getDataMapper(): DataMapper;
export declare function getLeaderboardKey(chain: Chain): string;
export declare function getChainStartBlockKey(chain: Chain, block: number): string;
export declare function getVaultEntityId({ network }: Chainish, { address }: Vaultish): string;
