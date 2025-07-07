import { FactoryAerodromeV2 } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";

FactoryAerodromeV2.PoolCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handlePoolCreation({
            poolId: event.params.pool,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'AERODROME V2',
            owner: event.transaction.from ?? event.srcAddress,
            fee: event.params.stable ? 1n : 0n,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});