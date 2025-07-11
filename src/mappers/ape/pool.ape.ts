import { FactoryApe } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";
import { getPool, getPoolId } from "../../utils/pool/repo.pool";
import {getToken, getTokenId} from "../../utils/tokens/repo.token";
import { createSwapEntity } from "../../utils/swap/handler.swap";
import { convertTokenToDecimal } from "../../utils/math/bigDecimal";
import { handleLiquidity } from "../../utils/liquidity/handle.liquidity";

FactoryApe.CreateToken.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        await handlePoolCreation({
            poolId: event.params.tokenAddress,
            token0: event.params.tokenAddress,
            token1: nativeWrappedToken,
            poolType: 'APE.STORE',
            owner: event.transaction.from || event.srcAddress,
            fee: 10000n,
            block: event.block.number,
            additionalId: event.params.tokenId.toString(),
            chainId: event.chainId,
            hash: event.transaction.hash,
            supplyIsValueLocked: true
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});

FactoryApe.Swap.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";
        const pool = await getPool(getPoolId(event.chainId, event.params.token), context);
        
        if (!pool) return;

        const isTokenToETH = event.params.amountInToken > 0n;
        const amount0 = isTokenToETH ? BigInt(event.params.amountInToken) : -BigInt(event.params.amountOutToken);
        const amount1 = isTokenToETH ? -BigInt(event.params.amountOutETH) : BigInt(event.params.amountInETH);

        createSwapEntity({
            poolId: event.params.token,
            sender: event.transaction.from || event.srcAddress,
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

        const newTotalReserveToken = pool.totalValueLockedToken.plus(convertTokenToDecimal(amount0, token.decimals))
        const newTotalReserveQuote = pool.totalValueLockedQuote.plus(convertTokenToDecimal(amount1, quote.decimals));

        await handleLiquidity({
            newTotalReserveToken: newTotalReserveToken,
            newTotalReserveQuote: newTotalReserveQuote,
            pool: pool,
            token: token,
            quote: quote,
            chainId: event.chainId,
            poolAddress: event.params.token,
            tokenPrice: convertTokenToDecimal(event.params.priceAfter, token.decimals)
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
        return;
    }
});

// FactoryApe.Launch.handlerWithLoader({
//     loader: async ({ event, context }) => {
//         return;
//     },
//
//     handler: async ({ event, context, loaderReturn }) => {
//         return;
//     }
// });