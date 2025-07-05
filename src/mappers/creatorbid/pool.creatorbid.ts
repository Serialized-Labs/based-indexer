// import { FactoryCreatorBid } from "generated";
// import { experimental_createEffect, S } from "envio";
// import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
// import { createPoolEntity } from "../../utils/pool/handler.pool";
// import { NETWORK_CONFIGS } from "../../config/config";
// import { createPublicClient, http } from "viem";
// import { base } from "viem/chains";
// import {getCreatorBidBondingCurveEffect} from "./effect.creatorbid";
//
// FactoryCreatorBid.TokenAdded.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         const config = NETWORK_CONFIGS[event.chainId];
//         const nativeWrappedToken = config?.nativeWrappedToken || "";
//
//         const [bondingCurve, tokenData] = await Promise.all([
//             context.effect(getCreatorBidBondingCurveEffect, {
//                 tokenAddress: event.params.token
//             }),
//             handleTokens(
//                 event.params.token,
//                 nativeWrappedToken,
//                 event.chainId,
//                 context,
//                 event.block.number
//             )
//         ]);
//
//         if (!bondingCurve) return undefined;
//
//         return {
//             ...tokenData,
//             bondingCurve: bondingCurve as string,
//             nativeWrappedToken
//         };
//     },
//
//     handler: async ({ event, context, loaderReturn }) => {
//         if (!loaderReturn || !loaderReturn.bondingCurve) return;
//
//         createPoolEntity({
//             poolId: loaderReturn.bondingCurve,
//             token0Address: event.params.token,
//             token1Address: loaderReturn.nativeWrappedToken,
//             poolType: "CREATOR.BID",
//             owner: event.transaction.from || event.srcAddress,
//             blockNumber: event.block.number,
//             chainId: event.chainId,
//             loaderReturn: loaderReturn,
//             context: context
//         });
//     }
// });