import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
export declare class QuickswapStrategy {
    static getValueSources(vault: VaultDefinitionModel): Promise<YieldSource[]>;
}
