import { Network } from '@badger-dao/sdk';
import { Controller, Get, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { getOrCreateChain } from '../chains/chains.utils';
import { TokenConfigModel } from './interfaces/token-config-model.interface';
import { TokenFullMap } from './interfaces/token-full.interface';
import { getFullTokens } from './tokens.utils';

@Controller('/tokens')
export class TokensController {
  @Get()
  @UseCache()
  @ContentType('json')
  @Summary('Get a summary of tokens related to the Badger Protocol')
  @Returns(200, TokenConfigModel)
  @Description('Return a map of checksum contract address to token information.')
  async getTokens(@QueryParams('chain') chain?: Network): Promise<TokenFullMap> {
    const requestChain = getOrCreateChain(chain);
    const chainTokens = Object.keys(requestChain.tokens);
    return getFullTokens(requestChain, chainTokens);
  }
}
