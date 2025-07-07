import { FactoryApe } from "generated";
import { handlePoolCreation } from "../../utils/pool/handler.pool";
import { NETWORK_CONFIGS } from "../../config/config";

FactoryApe.CreateToken.handlerWithLoader({
    loader: async ({ event, context }) => {
        const config = NETWORK_CONFIGS[event.chainId];
        const nativeWrappedToken = config?.nativeWrappedToken || "";

        await handlePoolCreation({
            poolId: event.params.tokenAddress,
            token0: event.params.tokenAddress,
            token1: nativeWrappedToken,
            poolType: 'APE.STORE',
            owner: event.transaction.from || event.srcAddress,
            fee: 10000n,
            block: event.block.number,
            additionalId: event.params.tokenId.toString(),
            chainId: event.chainId,
            hash: event.transaction.hash,
        }, context);
    },

    handler: async ({ event, context, loaderReturn }) => {
    }
});