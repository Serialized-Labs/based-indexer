import {PoolManager} from "generated";
import {handlePoolCreation} from "../../utils/pool/handler.pool";
import {getAmount0, getAmount1} from "../../utils/math/liquidityAmounts";
import {getPoolId} from "../../utils/pool/repo.pool";
import {handleLiquidityV3} from "../../utils/liquidity/handle.v3.liquidity";
import {createSwapEntity} from "../../utils/swap/handler.swap";

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

PoolManager.Swap.handlerWithLoader({
    loader: async ({event, context}) => {
        const pool = await context.Pool.get(getPoolId(event.chainId, event.params.id));
        if (!pool) return;


        const token0 = pool.isToken0Quote ? pool.quote_id : pool.token_id;
        const token1 = pool.isToken0Quote ? pool.token_id : pool.quote_id;

        const amount0 = event.params.amount0 * -1n;
        const amount1 = event.params.amount1 * -1n;

        createSwapEntity({
            poolId: event.params.id,
            chainId: event.chainId,
            sender: event.params.sender,
            recipient: event.params.sender,
            amount0: amount0,
            amount1: amount1,
            token0: token0,
            token1: token1,
            blockNumber: event.block.number,
            hash: event.transaction.hash,
        }, context);

        await handleLiquidityV3({
            amount0: amount0,
            amount1: amount1,
            pool: pool,
            sqrtPriceX96: event.params.sqrtPriceX96,
            tick: event.params.tick,
            chainId: event.chainId,
            poolAddress: event.params.id
        }, context);
    },

    handler: async ({event, context, loaderReturn}) => {
        return;
    }
});


PoolManager.ModifyLiquidity.handlerWithLoader({
    loader: async ({event, context}) => {
        const pool = await context.Pool.get(getPoolId(event.chainId, event.params.id));
        if (!pool) return;

        const [amount0Raw, amount1Raw] = await Promise.all([
            getAmount0(event.params.tickLower, event.params.tickUpper, BigInt(pool.tick), event.params.liquidityDelta, pool.sqrtPrice),
            getAmount1(event.params.tickLower, event.params.tickUpper, BigInt(pool.tick), event.params.liquidityDelta, pool.sqrtPrice)
        ])

        await handleLiquidityV3({
            amount0: amount0Raw,
            amount1: amount1Raw,
            pool: pool,
            chainId: event.chainId,
            poolAddress: event.params.id,
        }, context)
    },

    handler: async ({event, context, loaderReturn}) => {
        return;
    }
});