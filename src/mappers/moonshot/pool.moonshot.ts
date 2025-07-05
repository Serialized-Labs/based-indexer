// import { MoonshotFactory } from "generated";
// import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
// import { createPoolEntity } from "../../utils/pool/handler.pool";
// import { NETWORK_CONFIGS } from "../../config/config";
//
// MoonshotFactory.NewMoonshotToken.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         return await handleTokens(
//             event.params.moon,
//             nativeWrappedToken,
//             event.chainId,
//             context,
//             event.block.number
//         );
//     },
//
//     handler: async ({ event, context, loaderReturn }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         createPoolEntity({
//             poolId: event.params.moon,
//             token0Address: event.params.moon,
//             token1Address: nativeWrappedToken,
//             poolType: "MOONSHOT",
//             fee: 10000n,
//             owner: event.params.sender,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });
//
// MoonshotFactory.NewMoonshotTokenAndBuy.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         return await handleTokens(
//             event.params.moon,
//             nativeWrappedToken,
//             event.chainId,
//             context,
//             event.block.number
//         );
//     },
//
//     handler: async ({ event, context, loaderReturn }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         createPoolEntity({
//             poolId: event.params.moon,
//             token0Address: event.params.moon,
//             token1Address: nativeWrappedToken,
//             poolType: "MOONSHOT",
//             fee: 10000n,
//             owner: event.params.sender,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context,
//         });
//     }
// });