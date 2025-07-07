import {NETWORK_CONFIGS} from "../../config/config";
import {Token_t} from "../../../generated/src/db/Entities.gen";

export function isToken0Quote(token0: Token_t, token1: Token_t, chainId: number): boolean {
  const config = NETWORK_CONFIGS[chainId];
  if (!config) return true;

  const formattedToken0 = token0.address.toLowerCase();
  const formattedToken1 = token1.address.toLowerCase();

  const isToken0Native = config.natives.some(native => native.toLowerCase() === formattedToken0);
  const isToken1Native = config.natives.some(native => native.toLowerCase() === formattedToken1);

  if (isToken0Native) return true;
  if (isToken1Native) return false;

  const token0QuoteIndex = config.quotes.findIndex(quote => quote.toLowerCase() === formattedToken0);
  const token1QuoteIndex = config.quotes.findIndex(quote => quote.toLowerCase() === formattedToken1);

  if (token0QuoteIndex !== -1 && token1QuoteIndex === -1) return true;
  if (token0QuoteIndex === -1 && token1QuoteIndex !== -1) return false;
  if (token0QuoteIndex !== -1 && token1QuoteIndex !== -1) return token0QuoteIndex < token1QuoteIndex;

  return BigInt(formattedToken0) > BigInt(formattedToken1);
}

export function getTokenAndQuote(token0: Token_t, token1: Token_t, chainId: number): { token: Token_t; quote: Token_t; isToken0Quote: boolean } {
  const isToken0QuoteResult = isToken0Quote(token0, token1, chainId);

  return {
    token: isToken0QuoteResult ? token1 : token0,
    quote: isToken0QuoteResult ? token0 : token1,
    isToken0Quote: isToken0QuoteResult
  };
}