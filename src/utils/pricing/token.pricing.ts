import {BigDecimal} from "generated";
import {NETWORK_CONFIGS} from "../../config/config";
import {ONE_BD} from "../math/constants";
import {Pool_t, Token_t} from "../../../generated/src/db/Entities.gen";

export function findNativePerToken(pool: Pool_t, quote: Token_t): BigDecimal {
    const config = NETWORK_CONFIGS[pool.chain]
    const quoteAddress = quote.address.toLowerCase()

    let quotePrice = quote.price;
    if (config.nativeTokens.includes(quoteAddress)) {
        quotePrice = ONE_BD;
    }

    return pool.tokenPrice.multipliedBy(quotePrice)
}