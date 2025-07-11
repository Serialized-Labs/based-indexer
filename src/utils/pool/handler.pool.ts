import {LoaderContext} from "generated";
import {getTokenAndQuote} from "../tokens/quote.token";
import {EMPTY_ADDRESS} from "../../config/config";
import {Pool_t, Token_t} from "../../../generated/src/db/Entities.gen";
import {getPoolId, updatePool} from "./repo.pool";
import {getToken, getTokenId, updateToken} from "../tokens/repo.token";
import {getTokenMetadataEffect} from "../tokens/token.effect";
import {convertTokenToDecimal} from "../math/bigDecimal";
import {ZERO_BD} from "../math/constants";
import {sqrtPriceX96ToTokenPrice} from "../math/sqrtPriceMath";

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
    stable?: boolean;
    supplyIsValueLocked?: boolean;
}

export async function handlePoolCreation(params: PoolCreationParams, context: LoaderContext): Promise<{
    pool: Pool_t
    token: Token_t
    quote: Token_t
}> {
    const [token0Address, token1Address, token0Id, token1Id] = await Promise.all([
        params.token0.toLowerCase(),
        params.token1.toLowerCase(),
        getTokenId(params.chainId, params.token0.toLowerCase()),
        getTokenId(params.chainId, params.token1.toLowerCase())
    ]);

    const [existingToken0, existingToken1] = await Promise.all([
        getToken(token0Id, context),
        getToken(token1Id, context)
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
            totalSupply: convertTokenToDecimal(BigInt(token0Metadata?.totalSupply ?? 0n), token0Metadata?.decimals ?? 18),
            blockNumber: params.block,
            price: ZERO_BD,
            marketCap: ZERO_BD,
            biggestQuoteTVL: ZERO_BD,
            bestPool_id: undefined,
        };
    }

    if (!token1) {
        token1 = {
            id: token1Id,
            chain: params.chainId,
            address: token1Address,
            name: token1Metadata?.name ??  "Unknown",
            symbol: token1Metadata?.symbol ??  "UNKNOWN",
            decimals: token1Metadata?.decimals ??  18,
            totalSupply: convertTokenToDecimal(BigInt(token1Metadata?.totalSupply ?? 0n), token1Metadata?.decimals ?? 18),
            blockNumber: params.block,
            price: ZERO_BD,
            marketCap: ZERO_BD,
            biggestQuoteTVL: ZERO_BD,
            bestPool_id: undefined,
        };
    }

    let {token, quote, isToken0Quote} = getTokenAndQuote(token0, token1, params.chainId);
    const poolId = getPoolId(params.chainId, params.poolId);

    let tokenPrice = ZERO_BD;
    if (params.sqrtPrice) {
        tokenPrice = sqrtPriceX96ToTokenPrice(params.sqrtPrice, token0, token1, isToken0Quote)
    }

    if (!token.bestPool_id) {
        token = {
            ...token,
            bestPool_id: poolId,
            price: tokenPrice,
            biggestQuoteTVL: ZERO_BD
        }
    }

    const pool: Pool_t = {
        id: poolId,
        chain: params.chainId,
        address: params.poolId,
        token_id: token.id,
        quote_id: quote.id,
        isToken0Quote: isToken0Quote,
        poolType: params.poolType,
        owner: params.owner,
        fee: params.fee ?? 0n,
        tickSpacing: params.tickSpacing ?? -1n,
        sqrtPrice: params.sqrtPrice ?? -1n,
        tick: params.tick ?? -1n,
        hooks: params.hooks ?? EMPTY_ADDRESS,
        blockNumber: params.block,
        totalValueLockedQuote: ZERO_BD,
        totalValueLockedToken: params.supplyIsValueLocked ? token.totalSupply : ZERO_BD,
        tokenPrice: tokenPrice,
        additionalId: params.additionalId?.toString() ?? "",
        creationHash: params.hash,
        stable: params.stable ?? false,
    };

    updateToken(token0, context);
    updateToken(token1, context);
    updatePool(pool, context);

    return {
        pool: pool,
        token: token,
        quote: quote
    }
}