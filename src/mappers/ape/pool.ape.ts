// import { FactoryApe } from "generated";
// import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
// import { createPoolEntity } from "../../utils/pool/handler.pool";
// import { NETWORK_CONFIGS } from "../../config/config";
//
// FactoryApe.CreateToken.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         return await handleTokens(
//             event.params.tokenAddress,
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
//             poolId: event.params.tokenAddress,
//             token0Address: event.params.tokenAddress,
//             token1Address: nativeWrappedToken,
//             poolType: "APE.STORE",
//             owner: event.transaction.from || event.srcAddress,
//             fee: 10000n,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             additionalId: event.params.tokenId.toString(),
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });