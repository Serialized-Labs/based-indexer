import { FullMath } from "./fullMath";
import {Token_t} from "../../../generated/src/db/Entities.gen";
import {ADDRESS_ZERO} from "./constants";
import {BigDecimal} from "generated";
import {exponentToBigDecimal, safeDiv} from "./bigDecimal";

const Q96 = 2n ** 96n;
const Q192 = 2n ** 192n;


export class SqrtPriceMath {
  public static getAmount0Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    const numerator1 = liquidity << 96n;
    const numerator2 = sqrtRatioBX96 - sqrtRatioAX96;

    return roundUp
      ? FullMath.mulDivRoundingUp(
          FullMath.mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96),
          1n,
          sqrtRatioAX96
        )
      : (numerator1 * numerator2) / sqrtRatioBX96 / sqrtRatioAX96;
  }

  public static getAmount1Delta(
    sqrtRatioAX96: bigint,
    sqrtRatioBX96: bigint,
    liquidity: bigint,
    roundUp: boolean
  ): bigint {
    if (sqrtRatioAX96 > sqrtRatioBX96) {
      [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    const difference = sqrtRatioBX96 - sqrtRatioAX96;

    return roundUp
      ? FullMath.mulDivRoundingUp(liquidity, difference, Q96)
      : (liquidity * difference) / Q96;
  }
}

export function sqrtPriceX96ToTokenPrice(sqrtPriceX96: bigint, token0: Token_t, token1: Token_t, isToken0Quote: boolean): BigDecimal {
  const num = new BigDecimal((sqrtPriceX96 * sqrtPriceX96).toString());
  const denom = new BigDecimal(Q192.toString());
  const price1 = num
      .div(denom)
      .times(exponentToBigDecimal(token0.decimals))
      .div(exponentToBigDecimal(token1.decimals));

  const price0 = safeDiv(new BigDecimal("1"), price1);
  return isToken0Quote ? price0 : price1;
}