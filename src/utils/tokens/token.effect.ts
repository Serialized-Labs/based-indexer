import { experimental_createEffect, S } from "envio";
import {getTokenMetadata as fetchTokenMetadata, TokenMetadata} from "./metadata.token";

export const getTokenMetadataEffect = experimental_createEffect(
    {
        name: "getTokenMetadata",
        input: {
            address: S.string,
            chainId: S.number,
            blockNumber: S.bigint,
        },
        output: {
            name: S.string,
            symbol: S.string,
            decimals: S.number,
        },
    },
    async ({ input, context }) => {
        try {
            return await fetchTokenMetadata(input.address, input.chainId, input.blockNumber);
        } catch (error) {
            context.log.error(`Error fetching metadata for ${input.address}: ${error}`);
            return {
                name: "Unknown",
                symbol: "UNKNOWN",
                decimals: 18,
            } as TokenMetadata
        }
    }
); 