import { MoonshotFactory } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";

MoonshotFactory.NewMoonshotToken.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        await handlePoolCreation({
            poolId: event.params.moon,
            token0: event.params.moon,
            token1: nativeWrappedToken,
            poolType: 'MOONSHOT',
            fee: 10000n,
            owner: event.params.sender,
            block: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});

MoonshotFactory.NewMoonshotTokenAndBuy.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        await handlePoolCreation({
            poolId: event.params.moon,
            token0: event.params.moon,
            token1: nativeWrappedToken,
            poolType: 'MOONSHOT',
            fee: 10000n,
            owner: event.params.sender,
            block: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});