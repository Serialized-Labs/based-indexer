// import { FactoryUniswapV2 } from "generated";
// import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
// import { createPoolEntity } from "../../utils/pool/handler.pool";
//
// FactoryUniswapV2.PairCreated.handlerWithLoader({
//     loader: async ({ event, context }) => await handleTokens(
//         event.params.token0,
//         event.params.token1,
//         event.chainId,
//         context,
//         event.block.number
//     ),
//
//     handler: async ({ event, context, loaderReturn }) => {
//         createPoolEntity({
//             poolId: event.params.pair,
//             token0Address: event.params.token0,
//             token1Address: event.params.token1,
//             poolType: "UNISWAP V2",
//             owner: event.srcAddress,
//             fee: 3000n,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });