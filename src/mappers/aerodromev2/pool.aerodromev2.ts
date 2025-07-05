// import { FactoryAerodromeV2 } from "generated";
// import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
// import { createPoolEntity } from "../../utils/pool/handler.pool";
//
// FactoryAerodromeV2.PoolCreated.handlerWithLoader({
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
//             poolType: "AERODROME V2",
//             owner: event.srcAddress,
//             fee: event.params.stable ? 1n : 0n,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });