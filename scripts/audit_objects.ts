import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  const address = "0x6ce34e0f958183ed17f5d74469028319b08e9ad0cc68d32519bc6791fab9d1e1";

  console.log(`Auditing Address: ${address}`);
  const objects = await client.getOwnedObjects({
    owner: address,
    options: { showContent: true, showType: true }
  });

  console.log(`\nFetching Transaction History...`);
  const txs = await client.queryTransactionBlocks({
    filter: { ToAddress: address },
    options: { showEffects: true, showInput: true }
  });

  console.log(`Recent Transactions: ${txs.data.length}`);
  txs.data.slice(0, 5).forEach((tx: any, i: number) => {
    console.log(`[${i}] Digest: ${tx.digest}`);
    if (tx.effects?.created) {
      console.log(`    Created Objects: ${tx.effects.created.length}`);
    }
  });
}

main().catch(console.error);
