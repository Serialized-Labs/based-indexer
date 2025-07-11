import {BigIntAbs} from "../math/bigInt";
import {LoaderContext} from "../../../generated";
import {getPoolId} from "../pool/repo.pool";

interface CreateSwapParams {
    poolId: string
    sender: string
    amount0: bigint
    amount1: bigint
    token0: string
    token1: string
    blockNumber: number
    chainId: number
    hash: string
}

export function createSwapEntity(params: CreateSwapParams, context: LoaderContext) {
    const tokenIn = params.amount0 > 0n ? params.token1 : params.token0;
    const tokenOut = params.amount0 > 0n ? params.token0 : params.token1;
    const amountIn = params.amount0 > 0n ? BigIntAbs(params.amount1) : BigIntAbs(params.amount0);
    const amountOut = params.amount0 > 0n ? BigIntAbs(params.amount0) : BigIntAbs(params.amount1);

    context.Swap.set({
        id: params.hash,
        chain: params.chainId,
        pool_id: getPoolId(params.chainId, params.poolId),
        sender: params.sender,
        amountIn: amountOut,
        amountOut: amountIn,
        tokenIn_id: tokenOut,
        tokenOut_id: tokenIn,
        blockNumber: params.blockNumber,
    });
} 