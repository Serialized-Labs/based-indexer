import {NETWORK_CONFIGS} from "../../config/config";

export function isToken0Quote(token0Address: string, token1Address: string, chainId: number): boolean {
  const config = NETWORK_CONFIGS[chainId];
  if (!config) return true;

  const token0Lower = token0Address.toLowerCase();
  const token1Lower = token1Address.toLowerCase();

  const isToken0Native = config.natives.some(native => native.toLowerCase() === token0Lower);
  const isToken1Native = config.natives.some(native => native.toLowerCase() === token1Lower);

  if (isToken0Native) return true;
  if (isToken1Native) return false;

  const token0QuoteIndex = config.quotes.findIndex(quote => quote.toLowerCase() === token0Lower);
  const token1QuoteIndex = config.quotes.findIndex(quote => quote.toLowerCase() === token1Lower);

  if (token0QuoteIndex !== -1 && token1QuoteIndex === -1) return true;
  if (token0QuoteIndex === -1 && token1QuoteIndex !== -1) return false;
  if (token0QuoteIndex !== -1 && token1QuoteIndex !== -1) return token0QuoteIndex < token1QuoteIndex;

  return BigInt(token0Address.toLowerCase()) > BigInt(token1Address.toLowerCase());
}

export function getTokenAndQuote(token0Address: string, token1Address: string, chainId: number): { token: string; quote: string; isToken0Quote: boolean } {
  const isToken0QuoteResult = isToken0Quote(token0Address, token1Address, chainId);

  const token0Id = `${chainId}_${token0Address.toLowerCase()}`;
  const token1Id = `${chainId}_${token1Address.toLowerCase()}`;

  return {
    token: isToken0QuoteResult ? token1Id : token0Id,
    quote: isToken0QuoteResult ? token0Id : token1Id,
    isToken0Quote: isToken0QuoteResult
  };
}