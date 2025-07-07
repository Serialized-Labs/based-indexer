import { FactoryV3, PoolUniswapV3 } from "../../../generated";
import {getPoolId, handlePoolCreation} from "../../utils/pool/handler.pool";
import { createSwapEntity } from "../../utils/swap/handler.swap";

FactoryV3.PoolCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handlePoolCreation({
            poolId: event.params?.pool,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'UNISWAP V3',
            owner: event.transaction.from ?? event.srcAddress,
            fee: event.params.fee,
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

FactoryV3.PoolCreated.contractRegister(({ event, context }) => {
    context.addPoolUniswapV3(event.params.pool);
});

PoolUniswapV3.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
        const pool = await context.Pool.get(getPoolId(event.chainId, event.srcAddress));
        if (!pool) return;

        const token0 = pool.isToken0Quote ? pool.quote_id : pool.token_id;
        const token1 = pool.isToken0Quote ? pool.token_id : pool.quote_id;

        createSwapEntity({
            poolId: event.srcAddress,
            chainId: event.chainId,
            sender: event.params.sender,
            recipient: event.params.recipient,
            amount0: event.params.amount0,
            amount1: event.params.amount1,
            token0: token0,
            token1: token1,
            blockNumber: event.block.number,
            hash: event.transaction.hash,
        }, context);
    },
    handler: async ({ event, context }) => {

}});