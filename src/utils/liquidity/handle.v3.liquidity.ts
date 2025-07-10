import {LoaderContext} from "generated";
import {Pool_t, Token_t} from "../../../generated/src/db/Entities.gen";
import {getPool, getPoolId, updatePool} from "../pool/repo.pool";
import {getToken, updateToken} from "../tokens/repo.token";
import {findNativePerToken} from "../pricing/token.pricing";
import {convertTokenToDecimal} from "../math/bigDecimal";
import {sqrtPriceX96ToTokenPrice} from "../math/sqrtPriceMath";

export interface HandleLiquidityV3Params {
    amount0: bigint
    amount1: bigint
    pool?: Pool_t
    token?: Token_t
    quote?: Token_t
    sqrtPriceX96?: bigint
    tick?: bigint
    chainId: number
    poolAddress: string
}

export async function handleLiquidityV3(params: HandleLiquidityV3Params, context: LoaderContext): Promise<void> {
    const poolId = getPoolId(params.chainId, params.poolAddress);
    let pool = !params.pool ? await getPool(poolId, context): params.pool
    if (!pool) return;

    let [token, quote] = await Promise.all([
        !params.token ? getToken(pool.token_id, context) : params.token,
        !params.quote ? getToken(pool.quote_id, context) : params.quote
    ]);

    if (!token || !quote) return;

    const amountToken  = pool.isToken0Quote ? params.amount1 : params.amount0;
    const amountQuote  = pool.isToken0Quote ? params.amount0 : params.amount1;
    const diffReserveToken = convertTokenToDecimal(amountToken, token.decimals);
    const diffReserveQuote = convertTokenToDecimal(amountQuote, quote.decimals);

    pool = {
        ...pool,
        totalValueLockedToken: pool.totalValueLockedToken.plus(diffReserveToken),
        totalValueLockedQuote: pool.totalValueLockedQuote.plus(diffReserveQuote),
    }

    if (params.tick) {
        pool = {
            ...pool,
            tick: params.tick,
        }
    }

    if (params.sqrtPriceX96) {
        const token0 = pool.isToken0Quote ? quote : token;
        const token1 = pool.isToken0Quote ? token : quote;

        const priceBaseInQuote = sqrtPriceX96ToTokenPrice(params.sqrtPriceX96, token0, token1, pool.isToken0Quote);

        pool = {
            ...pool,
            tokenPrice: priceBaseInQuote,
            sqrtPrice: params.sqrtPriceX96
        }
    }

    if (pool.totalValueLockedQuote.isGreaterThan(token.biggestQuoteTVL) || token.bestPool_id === pool.id) {
        const price = findNativePerToken(pool, quote);
        token = {
            ...token,
            biggestQuoteTVL: pool.totalValueLockedQuote,
            bestPool_id: pool.id,
            price: price,
            marketCap: price.multipliedBy(token.totalSupply)
        }

        updateToken(token, context)
    }

    updatePool(pool, context);
}