import { FactoryCreatorBid } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";
import { getCreatorBidBondingCurveEffect } from "./effect.creatorbid";

FactoryCreatorBid.TokenAdded.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        const bondingCurve = await context.effect(getCreatorBidBondingCurveEffect, {
            tokenAddress: event.params.token
        });

        if (!bondingCurve) return;

        await handlePoolCreation({
            poolId: bondingCurve,
            token0: event.params.token,
            token1: nativeWrappedToken,
            poolType: 'CREATOR.BID',
            owner: event.transaction.from || event.srcAddress,
            block: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});