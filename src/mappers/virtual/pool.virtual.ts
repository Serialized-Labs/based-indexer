import {VirtualProxy, VirtualPool, BigDecimal} from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";
import { getPool, getPoolId } from "../../utils/pool/repo.pool";
import { getToken } from "../../utils/tokens/repo.token";
import { createSwapEntity } from "../../utils/swap/handler.swap";
import { convertTokenToDecimal } from "../../utils/math/bigDecimal";
import { handleLiquidity } from "../../utils/liquidity/handle.liquidity";
import {BigIntAbs} from "../../utils/math/bigInt";

VirtualProxy.Launched.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const virtualToken = config?.virtualToken || "";

        await handlePoolCreation({
            poolId: event.params.virtualLP,
            token0: event.params.token,
            token1: virtualToken,
            poolType: 'VIRTUAL',
            owner: event.transaction.from || event.srcAddress,
            fee: 10000n,
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

VirtualPool.Mint.handlerWithLoader({
    loader: async ({ event, context }) => {
        const poolId = getPoolId(event.chainId, event.srcAddress);
        let pool = await getPool(poolId, context);
        if (!pool) return;

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const reserveToken = convertTokenToDecimal(pool.isToken0Quote ? event.params.reserve1 : event.params.reserve0, token.decimals);
        const reserveQuote = convertTokenToDecimal(pool.isToken0Quote ? event.params.reserve0 : event.params.reserve1, quote.decimals);

        await handleLiquidity({
            newTotalReserveToken: reserveToken,
            newTotalReserveQuote: reserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.srcAddress
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

VirtualPool.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
        const pool = await getPool(getPoolId(event.chainId, event.srcAddress), context);
        if (!pool) return;

        const token0 = pool.isToken0Quote ? pool.quote_id : pool.token_id;
        const token1 = pool.isToken0Quote ? pool.token_id : pool.quote_id;

        const amount0 = BigInt(event.params.amount0Out) - BigInt(event.params.amount0In);
        const amount1 = BigInt(event.params.amount1Out) - BigInt(event.params.amount1In);

        createSwapEntity({
            poolId: event.srcAddress,
            sender: event.transaction.from || event.srcAddress,
            amount0: amount0,
            amount1: amount1,
            token0: token0,
            token1: token1,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const tokenAmount = convertTokenToDecimal(pool.isToken0Quote ? amount1 : amount0, token.decimals);
        const quoteAmount = convertTokenToDecimal(pool.isToken0Quote ? amount0 : amount1, quote.decimals);
        const isBuy = tokenAmount.gt(0);
        const factor = isBuy ? new BigDecimal(1) : new BigDecimal(-1);

        const newTotalReserveToken = pool.totalValueLockedToken.plus(tokenAmount.abs().multipliedBy(factor));
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(quoteAmount.abs().multipliedBy(factor));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.srcAddress
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

VirtualProxy.Launched.contractRegister(({ event, context }) => {
    context.addVirtualPool(event.params.virtualLP);
});