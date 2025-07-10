import {Token_t} from "../../../generated/src/db/Entities.gen";
import {LoaderContext} from "../../../generated";


const tokenCache = new Map<string, Token_t>();

export function getTokenId(chainId: number, address: string): string {
    return `${chainId}_${address.toLowerCase()}`;
}

export async function getToken(id: string, context: LoaderContext): Promise<Token_t | undefined> {
    const cachedToken = tokenCache.get(id);
    if (cachedToken) return cachedToken;

    const token = await context.Token.get(id);
    if (token) tokenCache.set(token.id, token);

    return token;
}

export function updateToken(token: Token_t, context: LoaderContext): void {
    tokenCache.set(token.id, token);
    context.Token.set(token);
}