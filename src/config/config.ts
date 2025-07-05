export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export interface NetworkConfig {
  quotes: string[];
  stablecoins: string[];
  natives: string[];
  nativeToken: string;
  virtualToken: string;
  nativeWrappedToken: string;
}

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  8453: {
    quotes: [
      "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "0x4200000000000000000000000000000000000006",
      "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
      "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
      "0x96419929d7949d6a801a6909c145c8eef6a40431",
      "0x333333c465a19c85f85c6cfbed7b16b0b26e3333",
      "0xb89d354ad1b0d95a48b3de4607f75a8cd710c1ba",
      "0x000000000d564d5be76f7f0d28fe52605afc7cf8",
      EMPTY_ADDRESS
    ],
    stablecoins: [
      "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2"
    ],
    natives: [
      EMPTY_ADDRESS,
      "0x4200000000000000000000000000000000000006",
      "0x000000000d564d5be76f7f0d28fe52605afc7cf8"
    ],
    nativeToken: EMPTY_ADDRESS,
    virtualToken: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    nativeWrappedToken: "0x4200000000000000000000000000000000000006"
  }
}; 