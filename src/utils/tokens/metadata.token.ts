import {getContract} from "viem";
import {client} from "../rpc/client.rpc";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const ERC20_ABI = [
    {
        inputs: [],
        name: "name",
        outputs: [{type: "string"}],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{type: "string"}],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{type: "uint8"}],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{type: "uint256"}],
        stateMutability: "view",
        type: "function",
    },
] as const;

export interface TokenMetadata {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

function sanitizeString(str: string): string {
    if (!str) return "";
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
}

export async function getTokenMetadata(address: string, chainId: number): Promise<TokenMetadata> {
    if (address.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
        return {
            name: "Native Token",
            symbol: "ETH",
            decimals: 18,
            totalSupply: "0",
        };
    }

    try {
        const normalizedAddress = address.toLowerCase();

        const res = await fetchTokenMetadataMulticall(normalizedAddress);

        return res;
    } catch (e) {
        console.error(`Error fetching metadata for ${address} on chain ${chainId}:`, e);
        return {
            name: "Unknown",
            symbol: "UNKNOWN",
            decimals: 18,
            totalSupply: "0",
        };
    }
}

async function fetchTokenMetadataMulticall(address: string): Promise<TokenMetadata> {
    const contract = getContract({
        address: address as `0x${string}`,
        abi: ERC20_ABI,
        client,
    });

    const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.read.name().catch(() => "unknown"),
        contract.read.symbol().catch(() => "UNKNOWN"),
        contract.read.decimals().catch(() => 18),
        contract.read.totalSupply().catch(() => 0n),
    ]);

    return {
        name: sanitizeString(name),
        symbol: sanitizeString(symbol),
        decimals: typeof decimals === "number" ? decimals : 18,
        totalSupply: totalSupply.toString(),
    };
}