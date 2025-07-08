import { FactoryUniswapV2, PoolUniswapV2 } from "generated";
import {getPool, getPoolId, handlePoolCreation} from "../../utils/pool/handler.pool";
import { createSwapEntity } from "../../utils/swap/handler.swap";

FactoryUniswapV2.PairCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        handlePoolCreation({
            poolId: event.params.pair,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'UNISWAP V2',
            owner: event.transaction.from ?? event.srcAddress,
            fee: 3000n,
            tickSpacing: 0n,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context).catch(() => {})
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

FactoryUniswapV2.PairCreated.contractRegister(({ event, context }) => {
    context.addPoolUniswapV2(event.params.pair);
});

PoolUniswapV2.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
        (async () => {
            const pool = await getPool(getPoolId(event.chainId, event.srcAddress), context);
            if (!pool) return;

            const token0 = pool.isToken0Quote ? pool.quote_id : pool.token_id;
            const token1 = pool.isToken0Quote ? pool.token_id : pool.quote_id;

            createSwapEntity({
                poolId: event.srcAddress,
                sender: event.params.sender,
                recipient: event.params.to,
                amount0: event.params.amount0Out > 0n ? -BigInt(event.params.amount0Out) : BigInt(event.params.amount0In),
                amount1: event.params.amount1Out > 0n ? -BigInt(event.params.amount1Out) : BigInt(event.params.amount1In),
                token0: token0,
                token1: token1,
                blockNumber: event.block.number,
                chainId: event.chainId,
                hash: event.transaction.hash,
            }, context);
        })().catch(() => {});
    },
    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});