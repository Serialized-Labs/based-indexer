import {createPublicClient, http} from "viem";
import * as dotenv from "dotenv";
dotenv.config();

export const client = createPublicClient({
    transport: http(process.env.RPC || "https://base.drpc.org", {batch: true}),
});