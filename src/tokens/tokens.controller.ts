import { Controller, Get, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { TokenConfigModel } from './interfaces/token-config-model.interface';

@Controller('/tokens')
export class TokensController {
  @Get()
  @ContentType('json')
  @Summary('Get a summary of tokens related to the Badger Protocol')
  @Returns(200, TokenConfigModel)
  @Description('Return a map of checksum contract address to token information.')
  async listSetts(@QueryParams('chain') chain?: ChainNetwork): Promise<TokenConfigModel> {
    return Chain.getChain(chain).tokens;
  }
}
