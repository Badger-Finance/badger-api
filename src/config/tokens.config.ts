import { ContractRegistry } from './interfaces/contract-registry.interface';
import { checksumEntries } from './util';

const RAW_TOKENS: ContractRegistry = {
  // eth tokens
  BADGER: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  DIGG: '0x798d1be841a82a273720ce31c822c61a67a601c3',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  XSUSHI: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
  FARM: '0xa0246c9032bC3A600820415aE600c6388619A14D',
  IBBTC: '0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F',
  DEFI_DOLLAR: '0x20c36f062a31865bED8a5B1e512D9a1A20AA333A',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  CVX: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  CVXCRV: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',
  BOR: '0xBC19712FEB3a26080eBf6f2F7849b417FdD792CA',
  BOR_OLD: '0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9',
  PNT: '0x89Ab32156e46F46D02ade3FEcbe5Fc4243B9AAeD',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  FRAX: '0x853d955acef822db058eb8505911ed77f175b99e',
  MIM: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
  HBTC: '0x0316EB71485b0Ab14103307bf65a021042c6d380',
  PBTC: '0x5228a22e72ccc52d415ecfd199f99d0665e7733b',
  OBTC: '0x8064d9Ae6cDf087b1bcd5BDf3531bD5d8C537a68',
  BBTC: '0x9be89d2a4cd102d8fecc6bf9da793be995c22541',
  TBTC: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
  RENBTC: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  SBTC: '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
  KEEP: '0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC',
  DROPT_2: '0x952F4Ac36EF204a28800AA1c1586C5261B600894',
  DROPT_3: '0x68c269b60c58c4ed50c63b217ba0ec7f8a371920',
  MBTC: '0x945Facb997494CC2570096c74b5F66A3507330a1',
  IMBTC: '0x17d8CBB6Bce8cEE970a4027d1198F6700A7a6c24',
  MHBTC: '0x48c59199Da51B7E30Ea200a74Ea07974e62C4bA7',
  MTA: '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2',
  WIBBTC: '0x8751d4196027d4e6da63716fa7786b5174f04c15',

  // curve tokens
  CRV_RENBTC: '0x49849c98ae39fff122806c06791fa73784fb3675',
  CRV_TBTC: '0x64eda51d3ad40d56b9dfc5554e06f94e1dd786fd',
  CRV_SBTC: '0x075b1bb99792c9e1041ba13afef80c91a1e70fb3',
  CRV_HBTC: '0xb19059ebb43466C323583928285a49f558E572Fd',
  CRV_PBTC: '0xDE5331AC4B3630f94853Ff322B66407e0D6331E8',
  CRV_OBTC: '0x2fE94ea3d5d4a175184081439753DE15AeF9d614',
  CRV_BBTC: '0x410e3E86ef427e30B9235497143881f717d93c2A',
  CRV_TRICRYPTO: '0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF',
  CRV_TRICRYPTO2: '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff',
  CRV_THREE: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
  CRV_CVXBVECVX: '0x04c90C198b2eFF55716079bc06d7CCc4aa4d7512',
  CRV_IBBTC: '0xFbdCA68601f835b27790D98bbb8eC7f05FDEaA9B',
  CRV_MIM_3CRV: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
  CRV_FRAX_3CRV: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',

  // bsc tokens
  CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  BTCB: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  BSC_BBADGER: '0x1F7216fdB338247512Ec99715587bb97BBf96eae',
  BSC_BDIGG: '0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA',

  // matic tokens
  MATIC_WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
  MATIC_USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  MATIC_DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  MATIC_USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  MATIC_IBBTC: '0x4EaC4c4e9050464067D673102F8E24b2FccEB350',
  MATIC_AMWBTC: '0x5c2ed810328349100A66B82b78a1791B101C9D61',
  MATIC_AMWETH: '0x28424507fefb6f7f8E9D3860F56504E4e5f5f390',
  MATIC_AMDAI: '0x27F8D03b3a2196956ED754baDc28D73be8830A6e',
  MATIC_AMUSDC: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F',
  MATIC_AMUSDT: '0x60D55F02A771d515e077c9C2403a1ef324885CeC',
  MATIC_CRV: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
  MATIC_BADGER: '0x1FcbE5937B0cc2adf69772D228fA4205aCF4D9b2',
  MATIC_SUSHI: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',

  // avalanche tokens
  AVAX_WBTC: '0x50b7545627a5162f82a992c33b87adc75187b218',
  AVAX_WAVAX: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',

  // arbitrum tokens
  ARB_BADGER: '0xBfa641051Ba0a0Ad1b0AcF549a89536A0D76472E',
  ARB_SUSHI: '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A',
  ARB_WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  ARB_WBTC: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
  ARB_USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  ARB_SWAPR: '0xdE903E2712288A1dA82942DDdF2c20529565aC30',
  ARB_IBBTC: '0x9ab3fd50fcae73a1aeda959468fd0d662c881b42',
  ARB_CRV: '0x11cdb42b0eb46d95f990bedd4695a6e3fa034978',
  ARB_CRV_RENBTC: '0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb',
  ARB_CRV_TRICRYPTO: '0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2',
  ARB_SWP_SWPR_WETH: '0xA66b20912cBEa522278f3056B4aE60D0d3EE271b',
  ARB_SWP_WBTC_WETH: '0x9a17d97fb5f76f44604270448ac77d55ac40c15c',
  ARB_SWP_BADGER_WETH: '0x3c6bd88cdd2aecf466e22d4ed86db6b8953fdb72',
  ARB_SWP_IBBTC_WETH: '0x6a060a569e04a41794d6b1308865a13F27D27E53',

  // multichain tokens
  MULTI_RENBTC: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
  MULTI_BADGER: '0x753fbc5800a8C8e3Fb6DC6415810d627A387Dfc9',

  // matic curve tokens
  MATIC_CRV_AM3CRV: '0xE7a24EF0C5e95Ffb0f6684b813A78F2a3AD7D171',
  MATIC_CRV_AMWBTC: '0xf8a57c1d3b9629b77b6726a042ca48990A84Fb49',

  // xdai tokens
  XDAI_WBTC: '0x8e5bbbb09ed1ebde8674cda39a0c169401db4252',
  XDAI_WETH: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',

  // uniswap tokens
  UNI_BADGER_WBTC: '0xcd7989894bc033581532d2cd88da5db0a4b12859',
  UNI_DIGG_WBTC: '0xe86204c4eddd2f70ee00ead6805f917671f56c52',

  // sushiswap tokens
  SUSHI_ETH_WBTC: '0xceff51756c56ceffca006cd410b03ffc46dd3a58',
  SUSHI_BADGER_WBTC: '0x110492b31c59716ac47337e616804e3e3adc0b4a',
  SUSHI_DIGG_WBTC: '0x9a13867048e01c663ce8ce2fe0cdae69ff9f35e3',
  SUSHI_IBBTC_WBTC: '0x18d98D452072Ac2EB7b74ce3DB723374360539f1',
  SUSHI_CRV_CVXCRV: '0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007',
  SUSHI_CVX_ETH: '0x05767d9EF41dC40689678fFca0608878fb3dE906',

  // sushiswap matic tokens
  MATIC_SUSHI_IBBTC_WBTC: '0x8F8e95Ff4B4c5E354ccB005c6B0278492D7B5907',

  // sushiswap xdai tokens
  XDAI_SUSHI_WBTC_WETH: '0xe21F631f47bFB2bC53ED134E83B8cff00e0EC054',

  // sushiswap arbitrum tokens
  ARB_SUSHI_WETH_SUSHI: '0x3221022e37029923aCe4235D812273C5A42C322d',
  ARB_SUSHI_WETH_WBTC: '0x515e252b2b5c22b4b2b6Df66c2eBeeA871AA4d69',

  // pancakeswap tokens
  PANCAKE_BNB_BTCB: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082',
  PANCAKE_OLD_BNB_BTCB: '0x7561EEe90e24F3b348E1087A005F78B4c8453524',
  PANCAKE_BBADGER_BTCB: '0x5A58609dA96469E9dEf3fE344bC39B00d18eb9A5',
  PANCAKE_BDIGG_BTCB: '0x81d776C90c89B8d51E9497D58338933127e2fA80',

  // quickswap tokens
  MATIC_QUICK_USDC_WBTC: '0xF6a637525402643B0654a54bEAd2Cb9A83C8B498',

  // eth vault tokens
  BBADGER: '0x19d97d8fa813ee2f51ad4b4e04ea08baf4dffc28',
  BDIGG: '0x7e7e112a68d8d2e221e11047a72ffc1065c38e1a',
  BUNI_BADGER_WBTC: '0x235c9e24d3fb2fafd58a2e49d454fdcd2dbf7ff1',
  BUNI_DIGG_WBTC: '0xc17078fdd324cc473f8175dc5290fae5f2e84714',
  BSUSHI_ETH_WBTC: '0x758a43ee2bff8230eeb784879cdcff4828f2544d',
  BSUSHI_BADGER_WBTC: '0x1862a18181346ebd9edaf800804f89190def24a5',
  BSUSHI_DIGG_WBTC: '0x88128580acdd9c04ce47afce196875747bf2a9f6',
  BCRV_SBTC: '0xd04c48a53c111300ad41190d63681ed3dad998ec',
  BCRV_RENBTC: '0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545',
  BCRV_TBTC: '0xb9d076fde463dbc9f915e5392f807315bf940334',
  BCRV_HRENBTC: '0xaf5a1decfa95baf63e0084a35c62592b774a2a87',
  BVYWBTC: '0x4b92d19c11435614cd49af1b589001b7c08cd4d5',
  BSUSHI_IBBTC_WBTC: '0x8a8FFec8f4A0C8c9585Da95D9D97e8Cd6de273DE',
  BCRV_HBTC: '0x8c76970747afd5398e958bdfada4cf0b9fca16c4',
  BCRV_PBTC: '0x55912d0cf83b75c492e761932abc4db4a5cb1b17',
  BCRV_OBTC: '0xf349c0faa80fc1870306ac093f75934078e28991',
  BCRV_BBTC: '0x5dce29e92b1b939f8e8c60dcf15bde82a85be4a9',
  BCRV_TRICRYPTO: '0xBE08Ef12e4a553666291E9fFC24fCCFd354F2Dd2',
  BCRV_TRICRYPTO2: '0x27E98fC7d05f54E544d16F58C194C2D7ba71e3B5',
  BCVX: '0x53c8e199eb2cb7c01543c137078a038937a68e40',
  BCVXCRV: '0x2B5455aac8d64C14786c3a29858E43b5945819C0',
  BRENBTC: '0x58CAc1409F1ffbdcBA6a58d54c94CAC3fb4C6F8B',
  BIMBTC: '0x599D92B453C010b1050d31C364f6ee17E819f193',
  BMHBTC: '0x26B8efa69603537AC8ab55768b6740b67664D518',
  BVECVX: '0xfd05D3C7fe2924020620A8bE4961bBaA747e6305',
  BVECVX_OLD: '0xE143aA25Eec81B4Fc952b38b6Bca8D2395481377',
  BCRV_CVXBVECVX: '0x937B8E917d0F36eDEBBA8E459C5FB16F3b315551',
  BCRV_IBBTC: '0xae96ff08771a109dc6650a1bdca62f2d558e40af',
  BCRV_MIM_3CRV: '0x19E4d89e0cB807ea21B8CEF02df5eAA99A110dA5',
  BCRV_FRAX_3CRV: '0x15cBC4ac1e81c97667780fE6DAdeDd04a6EEB47B',
  BREMBADGER: '0x6af7377b5009d7d154f36fe9e235ae1da27aea22',
  BREMDIGG: '0x99F39D495C6A5237f43602f3Ab5F49786E46c9B0',

  // bsc vault tokens
  BPANCAKE_BNB_BTCB: '0xaf4B9C4b545D5324904bAa15e29796D2E2f90813',
  BPANCAKE_BBADGER_BTCB: '0x857F91f735f4B03b19D2b5c6E476C73DB8241F55',
  BPANCAKE_BDIGG_BTCB: '0xa861Ba302674b08f7F2F24381b705870521DDfed',

  // polygon vault tokens
  BMATIC_SUSHI_IBBTC_WBTC: '0xEa8567d84E3e54B32176418B4e0C736b56378961',
  BMATIC_QUICK_USDC_WBTC: '0x6B2d4c4bb50274c5D4986Ff678cC971c0260E967',
  BMATIC_CRV_AMWBTC: '0x7B6bfB88904e4B3A6d239d5Ed8adF557B22C10FC',

  // xdai vault tokens
  BXDAI_SUSHI_WBTC_WETH: '0x30bCE7386e016D6038201F57D1bA52CbA7AEFeCf',

  // arbitrum vault tokens
  BARB_SUSHI_WETH_SUSHI: '0xe774d1fb3133b037aa17d39165b8f45f444f632d',
  BARB_SUSHI_WETH_WBTC: '0xFc13209cAfE8fb3bb5fbD929eC9F11a39e8Ac041',
  BARB_CRV_RENBTC: '0xBA418CDdd91111F5c1D1Ac2777Fa8CEa28D71843',
  BARB_CRV_TRICRYPTO: '0x4591890225394BF66044347653e112621AF7DDeb',
  BARB_CRV_TRICRYPTO_LITE: '0xfdb9e5a186FB7655aC9cD7CAFF3d6D4c6064cc50',
  BARB_SWP_SWPR_WETH: '0x0c2153e8aE4DB8233c61717cDC4c75630E952561',
  BARB_SWP_WBTC_WETH: '0xaf9aB64F568149361ab670372b16661f4380e80B',
  BARB_SWP_BADGER_WETH: '0xe9c12f06f8affd8719263fe4a81671453220389c',
  BARB_SWP_IBBTC_WETH: '0x60129b2b762952dfe8b21f40ee8aa3b2a4623546',

  // avalanche vault tokens
  BAVAX_WBTC: '0x711555f2b421da9a86a18dc163d04699310fe297',
};

export const TOKENS = checksumEntries(RAW_TOKENS);
