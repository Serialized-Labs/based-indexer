import {BigDecimal, HandlerContext, LoaderContext} from "generated";
import {getTokenAndQuote} from "../tokens/quote.token";
import {EMPTY_ADDRESS} from "../../config/config";
import {Pool_t} from "../../../generated/src/db/Entities.gen";
import {getTokenMetadataEffect} from "../tokens/token.effect";
import exp from "node:constants";

export interface PoolCreationParams {
    poolId: string;
    token0: string;
    token1: string;
    poolType: string;
    owner: string;
    fee?: bigint;
    tick?: bigint;
    tickSpacing?: bigint;
    hooks?: string;
    block: number;
    sqrtPrice?: bigint;
    additionalId?: string;
    chainId: number;
    hash: string;
}

export async function handlePoolCreation(params: PoolCreationParams, context: LoaderContext): Promise<void> {
    const token0Address = params.token0.toLowerCase();
    const token1Address = params.token1.toLowerCase();
    const token0Id = getTokenId(params.chainId, token0Address);
    const token1Id = getTokenId(params.chainId, token1Address);

    const [existingToken0, existingToken1] = await Promise.all([
        context.Token.get(token0Id),
        context.Token.get(token1Id)
    ])

    let token0 = existingToken0;
    let token1 = existingToken1;

    const [token0Metadata, token1Metadata] = await Promise.all([
        !token0 ? context.effect(getTokenMetadataEffect, {
            address: token0Address,
            chainId: params.chainId,
        }) : undefined,
        !token1 ? context.effect(getTokenMetadataEffect, {
            address: token1Address,
            chainId: params.chainId,
        }) : undefined
    ]);

    if (!token0) {
        token0 = {
            id: token0Id,
            chain: params.chainId,
            address: token0Address,
            name: token0Metadata?.name ?? "Unknown Token",
            symbol: token0Metadata?.symbol ?? "UNKNOWN",
            decimals: token0Metadata?.decimals ?? 18,
            totalSupply: BigInt(token0Metadata?.totalSupply ?? 0n),
            blockNumber: params.block,
            price: 0n,
            marketCap: 0n,
        };
    }

    if (!token1) {
        token1 = {
            id: token1Id,
            chain: params.chainId,
            address: token1Address,
            name: token1Metadata?.name ?? "Unknown",
            symbol: token1Metadata?.symbol ?? "UNKNOWN",
            decimals: token1Metadata?.decimals ?? 18,
            totalSupply: BigInt(token1Metadata?.totalSupply ?? 0n),
            blockNumber: params.block,
            price: 0n,
            marketCap: 0n,
        };
    }

    const {token, quote, isToken0Quote} = getTokenAndQuote(token0, token1, params.chainId);

    const pool: Pool_t = {
        id: getPoolId(params.chainId, params.poolId),
        chain: params.chainId,
        address: params.poolId,
        token_id: token.id,
        quote_id: quote.id,
        isToken0Quote: isToken0Quote,
        poolType: params.poolType,
        owner: params.owner,
        fee: params.fee ?? 0n,
        tickSpacing: params.tickSpacing ?? -1n,
        hooks: params.hooks ?? EMPTY_ADDRESS,
        blockNumber: params.block,
        totalValueLockedToken0: new BigDecimal(0),
        totalValueLockedToken1: new BigDecimal(0),
        additionalId: params.additionalId?.toString() ?? "",
        creationHash: params.hash,
    };

    context.Pool.set(pool);
    if (!existingToken0) context.Token.set(token0);
    if (!existingToken1) context.Token.set(token1);
}

export function getPoolId(chainId: number, poolId: string): string {
    return `${chainId}_${poolId.toLowerCase()}`;
}

export function getTokenId(chainId: number, address: string): string {
    return `${chainId}_${address.toLowerCase()}`;
}