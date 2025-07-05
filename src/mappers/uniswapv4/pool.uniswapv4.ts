import { PoolManager } from "generated";
import { handleTokens, saveTokensIfNeeded } from "../../utils/tokens/mapper.token";
import { createPoolEntity } from "../../utils/pool/handler.pool";

PoolManager.Initialize.handlerWithLoader({
    loader: async ({ event, context }) => await handleTokens(
        event.params.currency0,
        event.params.currency1,
        event.chainId,
        context,
        event.block.number
    ),

    handler: async ({ event, context, loaderReturn }) => {
        context.log.info('find');
        createPoolEntity({
            poolId: event.params.id,
            token0Address: event.params.currency0,
            token1Address: event.params.currency1,
            poolType: "UNISWAP V4",
            owner: event.srcAddress,
            fee: event.params.fee,
            tick: event.params.tick,
            tickSpacing: event.params.tickSpacing,
            hooks: event.params.hooks,
            blockNumber: event.block.number,
            sqrtPrice: event.params.sqrtPriceX96,
            chainId: event.chainId,
            loaderReturn: loaderReturn,
            context: context
        });
    }
});