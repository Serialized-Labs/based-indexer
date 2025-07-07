import {PoolManager} from "generated";
import {handlePoolCreation} from "../../utils/pool/handler.pool";

PoolManager.Initialize.handlerWithLoader({
    loader: async ({event, context}) => {
        await handlePoolCreation({
            poolId: event.params.id,
            token0: event.params.currency0,
            token1: event.params.currency1,
            poolType: 'UNISWAP V4',
            owner: event.transaction.from ?? event.srcAddress,
            fee: event.params.fee,
            tick: event.params.tick,
            tickSpacing: event.params.tickSpacing,
            hooks: event.params.hooks,
            block: event.block.number,
            sqrtPrice: event.params.sqrtPriceX96,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },
    handler: async ({event, context, loaderReturn}) => {
        //EMPTY
    },
});