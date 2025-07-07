import { FactoryPancakeSwapV2 } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";

FactoryPancakeSwapV2.PairCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handlePoolCreation({
            poolId: event.params.pair,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'PANCAKESWAP V2',
            owner: event.transaction.from ?? event.srcAddress,
            fee: 2500n,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});