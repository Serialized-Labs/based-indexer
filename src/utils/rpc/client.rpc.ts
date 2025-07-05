import { createPublicClient, http, type PublicClient } from "viem";
import * as dotenv from "dotenv";
dotenv.config();

const getRpcUrl = (chainId: number): string => {
    switch (chainId) {
        case 1:
            return process.env.ENVIO_MAINNET_RPC_URL || "https://eth.drpc.org";
        case 42161:
            return process.env.ENVIO_ARBITRUM_RPC_URL || "https://arbitrum.drpc.org";
        case 10:
            return process.env.ENVIO_OPTIMISM_RPC_URL || "https://optimism.drpc.org";
        case 8453:
            return process.env.ENVIO_BASE_RPC_URL || "https://base.drpc.org";
        case 137:
            return process.env.ENVIO_POLYGON_RPC_URL || "https://polygon.drpc.org";
        case 43114:
            return (
                process.env.ENVIO_AVALANCHE_RPC_URL || "https://avalanche.drpc.org"
            );
        case 56:
            return process.env.ENVIO_BSC_RPC_URL || "https://bsc.drpc.org";
        case 81457:
            return process.env.ENVIO_BLAST_RPC_URL || "https://blast.drpc.org";
        case 7777777:
            return process.env.ENVIO_ZORA_RPC_URL || "https://zora.drpc.org";
        case 1868:
            return process.env.ENVIO_SONIEUM_RPC_URL || "https://sonieum.drpc.org";
        case 130:
            return process.env.ENVIO_UNICHAIN_RPC_URL || "https://unichain.drpc.org";
        case 57073:
            return process.env.ENVIO_INK_RPC_URL || "https://ink.drpc.org";
        case 480:
            return (
                process.env.ENVIO_WORLDCHAIN_RPC_URL || "https://worldchain.drpc.org"
            );
        // Add generic fallback for any chain
        default:
            throw new Error(`No RPC URL configured for chainId ${chainId}`);
    }
};


const clients: Record<number, PublicClient> = {};

// Get client for a specific chain
export const getClient = (chainId: number): PublicClient => {
    if (!clients[chainId]) {
        try {
            // Create a simpler client configuration
            clients[chainId] = createPublicClient({
                transport: http(getRpcUrl(chainId)),
            });
            console.log(`Created client for chain ${chainId}`);
        } catch (e) {
            console.error(`Error creating client for chain ${chainId}:`, e);
            throw e;
        }
    }
    return clients[chainId];
};