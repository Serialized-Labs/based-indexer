import {EffectContext} from "envio";
import {createClient} from "redis";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const initRedis = async (): Promise<void> => {
    if (!redisClient.isOpen) await redisClient.connect();
};

const getTokenMetadataFromRedis = async (address: string, chainId: number, context: EffectContext): Promise<TokenMetadata | null> => {
    await initRedis();
    
    try {
        const fields = await redisClient.hmGet(address, ['name', 'symbol', 'decimals', 'totalSupply']) as (string | null)[];
        if (!fields || fields.length < 4) return null;
        
        const name = fields[0];
        const symbol = fields[1];
        const decimals = fields[2];
        const totalSupply = fields[3];
        
        if (name && symbol && decimals && totalSupply) {
            return {
                name: name,
                symbol: symbol,
                decimals: parseInt(decimals),
                totalSupply: totalSupply,
            };
        }
        return null;
    } catch (e) {
        context.log.error(`Failed to get token metadata for ${address} on chain ${chainId}: ${e}`);
        return null;
    }
};

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

export async function getTokenMetadata(address: string, chainId: number, context: EffectContext): Promise<TokenMetadata> {
    if (address.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
        return {
            name: "Native Token",
            symbol: "ETH",
            decimals: 18,
            totalSupply: "0",
        };
    }

    const normalizedAddress = address.toLowerCase();
    return await fetchTokenMetadataMulticall(normalizedAddress, chainId, context);
}

async function fetchTokenMetadataMulticall(address: string, chainId: number, context: EffectContext): Promise<TokenMetadata> {
    const cachedMetadata = await getTokenMetadataFromRedis(address, chainId, context);
    if (cachedMetadata) return cachedMetadata;

    return {
        name: "Unknown Token",
        symbol: "UNKNOWN",
        decimals: 18,
        totalSupply: "0",
    }

    // const contract = getContract({
    //     address: address as `0x${string}`,
    //     abi: ERC20_ABI,
    //     client,
    // });
    //
    // const [name, symbol, decimals, totalSupply] = await Promise.all([
    //     contract.read.name(),
    //     contract.read.symbol(),
    //     contract.read.decimals(),
    //     contract.read.totalSupply(),
    // ]);
    //
    // return {
    //     name: sanitizeString(name),
    //     symbol: sanitizeString(symbol),
    //     decimals: decimals,
    //     totalSupply: totalSupply.toString(),
    // };
}