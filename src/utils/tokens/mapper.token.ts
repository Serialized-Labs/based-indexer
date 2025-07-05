import { getTokenMetadataEffect } from "./token.effect";
import {HandlerContext} from "../../../generated";
import {Token_t} from "../../../generated/src/db/Entities.gen";
import {TokenMetadata} from "./metadata.token";
import {S} from "envio";
import bigint = S.bigint;

export interface TokenHandlerResult {
    token0Address: string;
    token1Address: string;
    existingToken0?: Token_t;
    existingToken1?: Token_t;
    token0Metadata?: TokenMetadata;
    token1Metadata?: TokenMetadata;
}

export async function handleTokens(token0Address: string, token1Address: string, chainId: number, context: HandlerContext, blockNumber: number): Promise<TokenHandlerResult> {
    const token0Id = `${chainId}_${token0Address.toLowerCase()}`;
    const token1Id = `${chainId}_${token1Address.toLowerCase()}`;

    const [existingToken0, existingToken1] = await Promise.all([
        context.Token.get(token0Id),
        context.Token.get(token1Id)
    ]);

    const metadataPromises : (Promise<TokenMetadata> | undefined)[] = [];

    if (!existingToken0) {
        metadataPromises.push(context.effect(getTokenMetadataEffect, {
            address: token0Address,
            chainId: chainId,
            blockNumber: BigInt(blockNumber)
        }) as Promise<TokenMetadata>);
    } else {
        metadataPromises.push(undefined);
    }

    if (!existingToken1) {
        metadataPromises.push(context.effect(getTokenMetadataEffect, {
                address: token1Address,
                chainId: chainId,
                blockNumber: BigInt(blockNumber)
        }) as Promise<TokenMetadata>);
    } else {
        metadataPromises.push(undefined);
    }

    const [token0Metadata, token1Metadata] = await Promise.all(metadataPromises);

    return {
        token0Address: token0Address,
        token1Address: token1Address,
        existingToken0: existingToken0,
        existingToken1: existingToken1,
        token0Metadata: token0Metadata,
        token1Metadata: token1Metadata
    };
}

export function saveTokensIfNeeded(loaderReturn: TokenHandlerResult, blockNumber: number, context: HandlerContext, chainId: number): void {
    const { token0Address, token1Address, existingToken0, existingToken1, token0Metadata, token1Metadata } = loaderReturn;

    if (!existingToken0 && token0Metadata) {
        context.Token.set({
            id: `${chainId}_${token0Address.toLowerCase()}`,
            address: token0Address.toLowerCase(),
            name: token0Metadata.name,
            symbol: token0Metadata.symbol,
            decimals: token0Metadata.decimals,
            totalSupply: 0n,
            blockNumber: BigInt(blockNumber),
            price: 0n,
            marketCap: 0n,
        });
    }

    if (!existingToken1 && token1Metadata) {
        context.Token.set({
            id: `${chainId}_${token1Address.toLowerCase()}`,
            address: token1Address.toLowerCase(),
            name: token1Metadata.name,
            symbol: token1Metadata.symbol,
            decimals: token1Metadata.decimals,
            totalSupply: 0n,
            blockNumber: BigInt(blockNumber),
            price: 0n,
            marketCap: 0n,
        });
    }
} 