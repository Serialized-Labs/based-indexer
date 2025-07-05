import {experimental_createEffect, S} from "envio";
import {getClient} from "../../utils/rpc/client.rpc";

export const getCreatorBidBondingCurveEffect = experimental_createEffect(
    {
        name: "getCreatorBidBondingCurve",
        input: {
            tokenAddress: S.string,
            chainId: S.number,
        },
        output: S.optional(S.string),
    },
    async ({ input, context }) => {
        try {
            const result = await getClient(input.chainId).readContract({
                address: input.tokenAddress as `0x${string}`,
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
            return result as string;
        } catch (error) {
            context.log.error(`Error fetching bonding curve for ${input.tokenAddress}: ${error}`);
            return undefined;
        }
    }
);
