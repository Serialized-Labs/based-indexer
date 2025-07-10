import { BigDecimal } from "generated";
import {ZERO_BD} from "./constants";

export function exponentToBigDecimal(decimals: number): BigDecimal {
    let resultString = "1";
    for (let i = 0; i < decimals; i++) {
        resultString += "0";
    }
    return new BigDecimal(resultString);
}

export function convertTokenToDecimal(tokenAmount: bigint, exchangeDecimals: number): BigDecimal {
    if (exchangeDecimals == 0) {
        return new BigDecimal(tokenAmount.toString());
    }

    return new BigDecimal(tokenAmount.toString()).div(exponentToBigDecimal(exchangeDecimals));
}

export function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
    if (amount1.eq(ZERO_BD)) {
        return ZERO_BD;
    } else {
        return amount0.div(amount1);
    }
}
