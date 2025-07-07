// import {FactoryPancakeSwapV3} from "generated";
// import {handleTokens} from "../../utils/tokens/mapper.token";
//
// FactoryPancakeSwapV3.PoolCreated.handlerWithLoader({
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
//             poolId: event.params.pool,
//             token0Address: event.params.token0,
//             token1Address: event.params.token1,
//             poolType: "PANCAKESWAP V3",
//             owner: event.srcAddress,
//             fee: event.params.fee,
//             tick: event.params.tickSpacing,
//             tickSpacing: event.params.tickSpacing,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });