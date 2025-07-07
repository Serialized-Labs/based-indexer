import { BigDecimal } from "generated";

export function exponentToBigDecimal(decimals: bigint): BigDecimal {
    let resultString = "1";
    for (let i = 0; i < Number(decimals); i++) {
        resultString += "0";
    }
    return new BigDecimal(resultString);
}

export function convertTokenToDecimal(tokenAmount: bigint, exchangeDecimals: bigint): BigDecimal {
    if (exchangeDecimals == 0n) {
        return new BigDecimal(tokenAmount.toString());
    }

    return new BigDecimal(tokenAmount.toString()).div(exponentToBigDecimal(exchangeDecimals));
}
