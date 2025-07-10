import { FactoryAerodromeV2, PoolAerodromeV2 } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { getPool, getPoolId } from "../../utils/pool/repo.pool";
import { getToken } from "../../utils/tokens/repo.token";
import { createSwapEntity } from "../../utils/swap/handler.swap";
import { convertTokenToDecimal } from "../../utils/math/bigDecimal";
import { handleLiquidity } from "../../utils/liquidity/handle.liquidity";

FactoryAerodromeV2.PoolCreated.handlerWithLoader({
    loader: async ({ event, context }) => {
        await handlePoolCreation({
            poolId: event.params.pool,
            token0: event.params.token0,
            token1: event.params.token1,
            poolType: 'AERODROME V2',
            owner: event.transaction.from ?? event.srcAddress,
            fee: event.params.stable ? 500n : 3000n,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
            stable: event.params.stable,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

PoolAerodromeV2.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
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
    },
    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

PoolAerodromeV2.Sync.handlerWithLoader({
    loader: async ({ event, context }) => {
        const poolId = getPoolId(event.chainId, event.srcAddress);
        let pool = await getPool(poolId, context);
        if (!pool) return;

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const reserveToken = convertTokenToDecimal(pool.isToken0Quote ? event.params.reserve1 : event.params.reserve0, token.decimals)
        const reserveQuote = convertTokenToDecimal(pool.isToken0Quote ? event.params.reserve0 : event.params.reserve1, quote.decimals);

        await handleLiquidity({
            newTotalReserveToken: reserveToken,
            newTotalReserveQuote: reserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            srcAddress: event.srcAddress
        }, context)
    },
    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

FactoryAerodromeV2.PoolCreated.contractRegister(({ event, context }) => {
    context.addPoolAerodromeV2(event.params.pool);
});