import {LoaderContext} from "../../../generated";
import {Pool_t} from "../../../generated/src/db/Entities.gen";

// const poolCache = new Map<string, Pool_t>();

export function getPoolId(chainId: number, poolId: string): string {
    return `${chainId}_${poolId.toLowerCase()}`;
}

export async function getPool(id: string, context: LoaderContext): Promise<Pool_t | undefined>  {
    // const cachedPool = poolCache.get(id);
    // if (cachedPool) return cachedPool;

    const pool = await context.Pool.get(id);
    // if (pool) poolCache.set(pool.id, pool);

    return pool;
}

export function updatePool(pool: Pool_t, context: LoaderContext): void {
    context.Pool.set(pool);
    // poolCache.set(pool.id, pool)
}


