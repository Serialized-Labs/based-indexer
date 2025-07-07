import {BigIntAbs} from "../math/bigInt";
import {LoaderContext} from "../../../generated";

interface CreateSwapParams {
    poolId: string
    sender: string
    recipient: string
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

    const swapId = `${params.blockNumber}-${params.amount0}-${params.amount1}-${params.sender}`;

    context.Swap.set({
        id: swapId,
        chain: params.chainId,
        pool_id: params.poolId,
        sender: params.sender,
        recipient: params.recipient,
        amountIn: BigInt(amountIn),
        amountOut: BigInt(amountOut),
        tokenIn_id: tokenIn,
        tokenOut_id: tokenOut,
        blockNumber: params.blockNumber,
        hash: params.hash,
    });
} 