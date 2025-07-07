import { FactoryAerodromeV3 } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";

FactoryAerodromeV3.PoolCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handlePoolCreation({
            poolId: event.params.pool,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'AERODROME V3',
            owner: event.transaction.from ?? event.srcAddress,
            tickSpacing: event.params.tickSpacing,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});