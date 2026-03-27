import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  const envPath = path.resolve(__dirname, "..", "frontend", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const packageId = envContent.match(/NEXT_PUBLIC_PACKAGE_ID=(0x[a-fA-F0-0-9]+)/)?.[1];

  if (!packageId) throw new Error("Package ID not found");

  console.log(`Checking for Boss objects in Package: ${packageId}`);
  
  // Search for the latest Boss object using direct binary RPC call
  const objects = await client.call("suix_queryObjects", [
    { StructType: `${packageId}::raid::Boss` },
    null,
    10,
    true
  ]) as any;

  console.log(`Found ${objects.data.length} Boss objects.`);
  objects.data.forEach((obj: any, i: number) => {
    const fields = obj.data.content.fields;
    console.log(`[${i}] ID: ${obj.data.objectId}`);
    console.log(`    Name: ${fields.name}`);
    console.log(`    HP: ${fields.current_hp}/${fields.max_hp}`);
  });
}

main().catch(console.error);
