export function BigIntAbs(value: bigint): bigint {
    return value < 0n ? -value : value;
}