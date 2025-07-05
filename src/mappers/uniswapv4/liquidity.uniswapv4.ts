// /*
//  * Liquidity event handlers for Uniswap v4 pools
//  */
// import {PoolManager} from "generated";
// import {getAmount0, getAmount1} from "../../utils/liquidityMath/liquidityAmounts";
// import {convertTokenToDecimal} from "../../utils/liquidityMath/bigDecimal";
//
// PoolManager.ModifyLiquidity.handlerWithLoader({
//   loader: async ({ event, context }) => {
//     const poolId = `${event.chainId}_${event.params.id}`;
//
//     const pool = await context.Pool.get(poolId);
//     if (!pool) return null;
//
//     const [token0, token1] = await Promise.all([
//       context.Token.get(pool.token_id),
//       context.Token.get(pool.quote_id)
//     ]);
//
//     return { pool, token0, token1 };
//   },
//
//   handler: async ({ event, context, loaderReturn }) => {
//     if (!loaderReturn || !loaderReturn.pool || !loaderReturn.token0 || !loaderReturn.token1) return;
//
//     const { pool, token0, token1 } = loaderReturn;
//
//     const amount0Raw = getAmount0(event.params.tickLower, event.params.tickUpper, BigInt(pool.tick), event.params.liquidityDelta, pool.sqrtPrice);
//     const amount1Raw = getAmount1(event.params.tickLower, event.params.tickUpper, BigInt(pool.tick), event.params.liquidityDelta, pool.sqrtPrice);
//
//     const amount0 = convertTokenToDecimal(amount0Raw, token0.decimals);
//     const amount1 = convertTokenToDecimal(amount1Raw, token1.decimals);
//
//     context.Pool.set({
//       ...pool,
//       totalValueLockedToken0: pool.totalValueLockedToken0.plus(amount0),
//       totalValueLockedToken1: pool.totalValueLockedToken1.plus(amount1),
//     });
//   }
// });
