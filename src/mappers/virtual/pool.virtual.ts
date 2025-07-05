// import {VirtualProxy} from "generated";
// import {handleTokens} from "../../utils/tokens/mapper.token";
// import {createPoolEntity} from "../../utils/pool/handler.pool";
// import {NETWORK_CONFIGS} from "../../config/config";
//
// VirtualProxy.Launched.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const virtualToken = config?.virtualToken || "";
//
//         return await handleTokens(
//             event.params.token,
//             virtualToken,
//             event.chainId,
//             context,
//             event.block.number
//         );
//     },
//
//     handler: async ({ event, context, loaderReturn }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const virtualToken = config?.virtualToken || "";
//
//         createPoolEntity({
//             poolId: event.params.virtualLP,
//             token0Address: event.params.token,
//             token1Address: virtualToken,
//             poolType: "VIRTUAL",
//             owner: event.transaction.from || event.srcAddress,
//             fee: 10000n,
//             tick: -1n,
//             tickSpacing: -1n,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });