import {EffectContext, experimental_createEffect, S} from "envio";
import {client} from "../../utils/rpc/client.rpc";
import exp from "node:constants";
import {Context} from "node:vm";

const bondingCurveCache = new Map<string, string>();

export const getCreatorBidBondingCurveEffect = experimental_createEffect(
    {
        name: "getCreatorBidBondingCurve",
        input: {
            tokenAddress: S.string,
        },
        output: S.optional(S.string),
    },
    async ({ input, context }) => {
        return getCreatorBidBondingCurve(input.tokenAddress, context);
    }
);

export async function getCreatorBidBondingCurve(tokenAddress: string, context: Context): Promise<string | undefined> {
    try {
        const cache = bondingCurveCache.get(tokenAddress);
        if (cache) return cache;

        const result = await client.readContract({
            address: tokenAddress as `0x${string}`,
            abi: [
                {
                    inputs: [],
                    name: "bondingCurve",
                    outputs: [{ internalType: "address", name: "", type: "address" }],
                    stateMutability: "view",
                    type: "function"
                }
            ],
            functionName: "bondingCurve",
        });

        if (result) bondingCurveCache.set(tokenAddress, result as string);
        return result as string;
    } catch (error) {
        context.log.error(`Error fetching bonding curve for ${tokenAddress}: ${error}`);
        return undefined;
    }
}
