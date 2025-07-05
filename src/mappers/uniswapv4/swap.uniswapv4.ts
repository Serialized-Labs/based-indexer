// /*
//  * Swap event handlers for Uniswap v4 pools
//  */
// import { PoolManager, BigDecimal } from "generated";
// import { convertTokenToDecimal } from "../../utils/liquidityMath/bigDecimal";
//
// PoolManager.Swap.handlerWithLoader({
//   loader: async ({ event, context }) => {
//     const poolId = `${event.chainId}_${event.params.id}`;
//     const pool = await context.Pool.get(poolId);
//
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
//     const amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals).times(BigDecimal(-1))
//     const amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals).times(BigDecimal(-1))
//
//     context.Pool.set({
//       ...pool,
//       tick: event.params.tick,
//       totalValueLockedToken0: pool.totalValueLockedToken0.plus(amount0),
//       totalValueLockedToken1: pool.totalValueLockedToken1.plus(amount1),
//       sqrtPrice: event.params.sqrtPriceX96,
//     });
//   }
// });
