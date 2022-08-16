import { Protocol } from '@badger-dao/sdk';
import { VaultDefinitionModel } from 'src/aws/models/vault-definition.model';
import { YieldSource } from 'src/aws/models/yield-source.model';
import { Chain } from 'src/chains/config/chain.config';

import { BalancerStrategy } from './strategies/balancer.strategy';
import { ConvexStrategy } from './strategies/convex.strategy';
import { OxDaoStrategy } from './strategies/oxdao.strategy';
import { SushiswapStrategy } from './strategies/sushiswap.strategy';
import { SwaprStrategy } from './strategies/swapr.strategy';
import { UniswapStrategy } from './strategies/uniswap.strategy';

export async function getProtocolValueSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<YieldSource[]> {
  try {
    switch (vaultDefinition.protocol) {
      case Protocol.Sushiswap:
        return SushiswapStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Curve:
      case Protocol.Convex:
        return ConvexStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Uniswap:
        return UniswapStrategy.getValueSources(vaultDefinition);
      case Protocol.Swapr:
        return SwaprStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.OxDAO:
        return OxDaoStrategy.getValueSources(chain, vaultDefinition);
      case Protocol.Aura:
      case Protocol.Balancer:
        return BalancerStrategy.getValueSources(vaultDefinition);
      default: {
        return [];
      }
    }
  } catch (error) {
    console.log({ error, message: `Failed to update value sources for ${vaultDefinition.protocol}` });
    return [];
  }
}
