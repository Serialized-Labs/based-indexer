import { MoonshotFactory } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";
import { getPool, getPoolId } from "../../utils/pool/repo.pool";
import { getToken } from "../../utils/tokens/repo.token";
import { createSwapEntity } from "../../utils/swap/handler.swap";
import { convertTokenToDecimal } from "../../utils/math/bigDecimal";
import { handleLiquidity } from "../../utils/liquidity/handle.liquidity";
import {BigIntAbs} from "../../utils/math/bigInt";

MoonshotFactory.NewMoonshotToken.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        await handlePoolCreation({
            poolId: event.params.moon,
            token0: event.params.moon,
            token1: nativeWrappedToken,
            poolType: 'MOONSHOT',
            fee: 10000n,
            owner: event.params.sender,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});

MoonshotFactory.NewMoonshotTokenAndBuy.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        const res = await handlePoolCreation({
            poolId: event.params.addr,
            token0: event.params.addr,
            token1: nativeWrappedToken,
            poolType: 'MOONSHOT',
            fee: 10000n,
            owner: event.params.creator,
            block: event.block.number,
            additionalId: "",
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        const totalValueLockedToken = convertTokenToDecimal(BigIntAbs(event.params.tokenAmount), res.token.decimals);
        const totalValueLockedQuote = convertTokenToDecimal(BigIntAbs(event.params.collateralAmount), res.quote.decimals);

        await handleLiquidity({
            newTotalReserveToken: totalValueLockedToken,
            newTotalReserveQuote: totalValueLockedQuote,
            pool: res.pool,
            token: res.token,
            quote: res.quote,
            chainId: event.chainId,
            poolAddress: event.params.addr
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});

MoonshotFactory.BuyExactIn.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.params.token), context);
        
        if (!pool) return;

        const amount0 = -BigInt(event.params.tokenAmount);
        const amount1 = BigInt(event.params.collateralAmount);

        createSwapEntity({
            poolId: event.params.token,
            sender: event.params.buyer,
            amount0: amount0,
            amount1: amount1,
            token0: event.params.token,
            token1: nativeWrappedToken,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const newTotalReserveToken = pool.totalValueLockedToken.plus(convertTokenToDecimal(BigIntAbs(amount0), token.decimals));
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(convertTokenToDecimal(BigIntAbs(amount1), quote.decimals));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.params.token
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

MoonshotFactory.BuyExactOut.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.params.token), context);
        
        if (!pool) return;

        const amount0 = -BigInt(event.params.tokenAmount);
        const amount1 = BigInt(event.params.collateralAmount);

        createSwapEntity({
            poolId: event.params.token,
            sender: event.params.buyer,
            amount0: amount0,
            amount1: amount1,
            token0: event.params.token,
            token1: nativeWrappedToken,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const newTotalReserveToken = pool.totalValueLockedToken.plus(convertTokenToDecimal(BigIntAbs(amount0), token.decimals));
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(convertTokenToDecimal(BigIntAbs(amount1), quote.decimals));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.params.token
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

MoonshotFactory.SellExactIn.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.params.token), context);
        
        if (!pool) return;

        const amount0 = BigInt(event.params.tokenAmount);
        const amount1 = -BigInt(event.params.collateralAmount);

        createSwapEntity({
            poolId: event.params.token,
            sender: event.params.seller,
            amount0: amount0,
            amount1: amount1,
            token0: event.params.token,
            token1: nativeWrappedToken,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const newTotalReserveToken = pool.totalValueLockedToken.plus(convertTokenToDecimal(BigIntAbs(amount0) * -1n, token.decimals));
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(convertTokenToDecimal(BigIntAbs(amount1) * -1n, quote.decimals));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.params.token
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

MoonshotFactory.SellExactOut.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.params.token), context);
        
        if (!pool) return;

        const amount0 = BigInt(event.params.tokenAmount);
        const amount1 = -BigInt(event.params.collateralAmount);

        createSwapEntity({
            poolId: event.params.token,
            sender: event.params.seller,
            amount0: amount0,
            amount1: amount1,
            token0: event.params.token,
            token1: nativeWrappedToken,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const newTotalReserveToken = pool.totalValueLockedToken.plus(convertTokenToDecimal(BigIntAbs(amount0) * -1n, token.decimals));
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(convertTokenToDecimal(BigIntAbs(amount1) * -1n, quote.decimals));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.params.token
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});