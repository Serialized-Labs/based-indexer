import {BigDecimal, FactoryCreatorBid, TokenCreatorBid} from "generated";
import {handlePoolCreation} from "../../utils/pool/handler.pool";
import {NETWORK_CONFIGS} from "../../config/config";
import {getCreatorBidBondingCurve, getCreatorBidBondingCurveEffect} from "./effect.creatorbid";
import {getPool, getPoolId} from "../../utils/pool/repo.pool";
import {getToken} from "../../utils/tokens/repo.token";
import {createSwapEntity} from "../../utils/swap/handler.swap";
import {convertTokenToDecimal} from "../../utils/math/bigDecimal";
import {handleLiquidity} from "../../utils/liquidity/handle.liquidity";


FactoryCreatorBid.TokenAdded.contractRegister(async ({ event, context }) => {
    const bondingCurve = await getCreatorBidBondingCurve(event.params.token, context);
    if (!bondingCurve) return;
    context.addTokenCreatorBid(bondingCurve);
});

FactoryCreatorBid.TokenAdded.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        const bondingCurve = await context.effect(getCreatorBidBondingCurveEffect, {
            tokenAddress: event.params.token
        });

        if (!bondingCurve) return;

        await handlePoolCreation({
            poolId: bondingCurve,
            token0: event.params.token,
            token1: nativeWrappedToken,
            poolType: 'CREATOR.BID',
            owner: event.transaction.from || event.srcAddress,
            fee: 10000n,
            block: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
            additionalId: "",
        }, context);

        return bondingCurve;
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});

TokenCreatorBid.Buy.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const pool = await getPool(getPoolId(event.chainId, event.srcAddress), context);
        
        if (!pool) return;

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const amount0 = pool.isToken0Quote ? BigInt(event.params.input) : -BigInt(event.params.output);
        const amount1 = pool.isToken0Quote ? -BigInt(event.params.output) : BigInt(event.params.input);

        createSwapEntity({
            poolId: event.srcAddress,
            sender: event.params.buyer,
            amount0: amount0,
            amount1: amount1,
            token0: pool.isToken0Quote ? quote.id : token.id,
            token1: pool.isToken0Quote ? token.id : quote.id,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        const ethReserve = convertTokenToDecimal(event.params.realReserves[0], quote.decimals);
        const tokenReserve = convertTokenToDecimal(event.params.realReserves[1], token.decimals);

        const virtualEthReserve = convertTokenToDecimal(event.params.virtualReserves[0], quote.decimals);
        const virtualTokenReserve = convertTokenToDecimal(event.params.virtualReserves[1], token.decimals);

        const price = virtualTokenReserve.isZero() ? new BigDecimal(0) : virtualEthReserve.div(virtualTokenReserve);

        const newTotalReserveToken = pool.isToken0Quote ? tokenReserve : tokenReserve;
        const newTotalReserveQuote = pool.isToken0Quote ? ethReserve : ethReserve;

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.srcAddress,
            tokenPrice: price
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

TokenCreatorBid.Sell.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.srcAddress), context);
        
        if (!pool) return;

        let [token, quote] = await Promise.all([
            getToken(pool.token_id, context),
            getToken(pool.quote_id, context)
        ]);

        if (!token || !quote) return;

        const amount0 = pool.isToken0Quote ? -BigInt(event.params.output) : BigInt(event.params.input);
        const amount1 = pool.isToken0Quote ? BigInt(event.params.input) : -BigInt(event.params.output);

        createSwapEntity({
            poolId: event.srcAddress,
            sender: event.params.seller,
            amount0: amount0,
            amount1: amount1,
            token0: pool.isToken0Quote ? quote.id : token.id,
            token1: pool.isToken0Quote ? token.id : quote.id,
            blockNumber: event.block.number,
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);

        const ethReserve = convertTokenToDecimal(event.params.realReserves[0], quote.decimals);
        const tokenReserve = convertTokenToDecimal(event.params.realReserves[1], token.decimals);

        const newTotalReserveToken = pool.isToken0Quote ? tokenReserve : tokenReserve;
        const newTotalReserveQuote = pool.isToken0Quote ? ethReserve : ethReserve;

        const virtualEthReserve = convertTokenToDecimal(event.params.virtualReserves[0], quote.decimals);
        const virtualTokenReserve = convertTokenToDecimal(event.params.virtualReserves[1], token.decimals);

        const price = virtualTokenReserve.isZero() ? new BigDecimal(0) : virtualEthReserve.div(virtualTokenReserve);

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.srcAddress,
            tokenPrice: price
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});