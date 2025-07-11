import {BigDecimal, LoaderContext} from "generated";
import {Pool_t, Token_t} from "../../../generated/src/db/Entities.gen";
import {getPool, getPoolId, updatePool} from "../pool/repo.pool";
import {getToken, updateToken} from "../tokens/repo.token";
import {findNativePerToken} from "../pricing/token.pricing";

export interface HandleLiquidityParams {
    newTotalReserveToken: BigDecimal
    newTotalReserveQuote: BigDecimal
    pool?: Pool_t
    token?: Token_t
    quote?: Token_t
    chainId: number
    poolAddress: string
    tokenPrice?: BigDecimal
}

export async function handleLiquidity(params: HandleLiquidityParams, context: LoaderContext): Promise<void> {
    const poolId = getPoolId(params.chainId, params.poolAddress);
    let pool = !params.pool ? await getPool(poolId, context): params.pool
    if (!pool) return;

    let [token, quote] = await Promise.all([
        !params.token ? getToken(pool.token_id, context) : params.token,
        !params.quote ? getToken(pool.quote_id, context) : params.quote
    ]);

    if (!token || !quote) return;

    let tokenPrice = !params.newTotalReserveToken.eq(0) ? params.newTotalReserveQuote.div(params.newTotalReserveToken) : new BigDecimal(0);
    if (params.tokenPrice) {
        tokenPrice = params.tokenPrice;
    }

    pool = {
        ...pool,
        totalValueLockedToken: params.newTotalReserveToken,
        totalValueLockedQuote: params.newTotalReserveQuote,
        tokenPrice: tokenPrice
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