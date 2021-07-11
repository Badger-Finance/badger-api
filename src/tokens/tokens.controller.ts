import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { TokenConfig } from './interfaces/token-config.interface';

@Controller('/tokens')
export class TokensController {
  @Get()
  @ContentType('json')
  async listSetts(@QueryParams('chain') chain?: ChainNetwork): Promise<TokenConfig> {
    return Chain.getChain(chain).tokens;
  }
}
