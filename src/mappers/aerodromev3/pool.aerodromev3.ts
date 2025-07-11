import { FactoryAerodromeV3, PoolAerodromeV3 } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { createSwapEntity } from "../../utils/swap/handler.swap";
import { getPoolId } from "../../utils/pool/repo.pool";
import { handleLiquidityV3 } from "../../utils/liquidity/handle.v3.liquidity";

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
        return;
    }
});

PoolAerodromeV3.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
        const pool = await context.Pool.get(getPoolId(event.chainId, event.srcAddress));
        if (!pool) return;

        const token0 = pool.isToken0Quote ? pool.quote_id : pool.token_id;
        const token1 = pool.isToken0Quote ? pool.token_id : pool.quote_id;

        createSwapEntity({
            poolId: event.srcAddress,
            chainId: event.chainId,
            sender: event.params.sender,
            amount0: event.params.amount0,
            amount1: event.params.amount1,
            token0: token0,
            token1: token1,
            blockNumber: event.block.number,
            hash: event.transaction.hash,
        }, context);

        await handleLiquidityV3({
            amount0: event.params.amount0,
            amount1: event.params.amount1,
            pool: pool,
            sqrtPriceX96: event.params.sqrtPriceX96,
            tick: event.params.tick,
            chainId: event.chainId,
            poolAddress: event.srcAddress
        }, context);
    },
    handler: async ({ event, context }) => {
        return;
    }
});

PoolAerodromeV3.Mint.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handleLiquidityV3({
            amount0: event.params.amount0,
            amount1: event.params.amount1,
            chainId: event.chainId,
            poolAddress: event.srcAddress
        }, context);
    },
    handler: async ({ event, context }) => {
        return;
    }
});

PoolAerodromeV3.Collect.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handleLiquidityV3({
            amount0: event.params.amount0 * -1n,
            amount1: event.params.amount1 * -1n,
            chainId: event.chainId,
            poolAddress: event.srcAddress
        }, context);
    },
    handler: async ({ event, context }) => {
        return;
    }
});

FactoryAerodromeV3.PoolCreated.contractRegister(({ event, context }) => {
    context.addPoolAerodromeV3(event.params.pool);
});