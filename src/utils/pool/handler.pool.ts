import {BigDecimal, HandlerContext} from "generated";
import {getTokenAndQuote} from "../tokens/quote.token";
import {EMPTY_ADDRESS} from "../../config/config";
import {Pool_t} from "../../../generated/src/db/Entities.gen";
import {saveTokensIfNeeded, TokenHandlerResult} from "../tokens/mapper.token";

export interface PoolCreationParams {
  poolId: string;
  token0Address: string;
  token1Address: string;
  poolType: string;
  owner: string;
  fee?: bigint;
  tick?: bigint;
  tickSpacing?: bigint;
  hooks?: string;
  blockNumber: number;
  sqrtPrice?: bigint;
  additionalId?: string;
  chainId: number;
  loaderReturn: TokenHandlerResult;
  context: HandlerContext;
}

export function createPoolEntity(params: PoolCreationParams): void {
  saveTokensIfNeeded(params.loaderReturn, params.blockNumber, params.context, params.chainId);

  const tokenOrder = getTokenAndQuote(params.token0Address, params.token1Address, params.chainId);

  const pool : Pool_t = {
    id: `${params.chainId}_${params.poolId}`,
    address: params.poolId,
    token_id: tokenOrder.token,
    quote_id: tokenOrder.quote,
    isToken0Quote: tokenOrder.isToken0Quote,
    poolType: params.poolType,
    owner: params.owner,
    fee: params.fee ?? 0n,
    tick: params.tick ?? -1n,
    tickSpacing: params.tickSpacing ?? -1n,
    hooks: params.hooks ?? EMPTY_ADDRESS,
    blockNumber: BigInt(params.blockNumber),
    totalValueLockedToken0: new BigDecimal(0),
    totalValueLockedToken1: new BigDecimal(0),
    sqrtPrice: params.sqrtPrice ?? -1n,
    additionalId: params.additionalId?.toString() ?? "",
  };

  params.context.Pool.set(pool);
} 