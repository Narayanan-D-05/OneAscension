import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  // Load deployer key
  const keyFile = path.resolve(__dirname, ".deploy_key.json");
  const raw = JSON.parse(fs.readFileSync(keyFile, "utf-8"));
  const parsedKey = decodeSuiPrivateKey(raw.bech32);
  const keypair = Ed25519Keypair.fromSecretKey(parsedKey.secretKey);
  const address = keypair.getPublicKey().toSuiAddress();
  const coins = await client.getCoins({ owner: address, coinType: '0x2::oct::OCT' });

  // Load current env to get Package ID
  const envPath = path.resolve(__dirname, "..", "frontend", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const packageId = envContent.match(/NEXT_PUBLIC_PACKAGE_ID\s*=\s*(0x[0-9a-fA-F]+)/)?.[1];

  if (!packageId) throw new Error("Package ID not found in .env.local");

  console.log(`Spawning Tutorial Boss for Package: ${packageId}`);

  const tx = new Transaction();
  tx.setSender(address);
  tx.setGasBudget(10_000_000); 
  tx.setGasPayment(coins.data.map((c: any) => ({
    objectId: c.coinObjectId,
    digest: c.digest,
    version: c.version
  })));

  tx.moveCall({
    target: `${packageId}::raid::spawn_boss`,
    arguments: [
      tx.pure.string("The Serpent"),
      tx.pure.u64(10), // Low HP (Defeatable in 1 hit)
      tx.pure.u64(5000) // High XP reward
    ],
  });

  let bossId: string | undefined;
  try {
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      options: { showObjectChanges: true },
    });
    console.log("Transaction Digest:", result.digest);
    const bossObj = result.objectChanges?.find(
        (c: any) => c.type === "created" && c.objectType.includes("Boss")
    );
    bossId = (bossObj as any)?.objectId;
  } catch (e: any) {
    console.error("RPC Error (might still have worked):", e.message);
    if (e.message.includes("504")) {
        console.log("Waiting 10s to see if it created anyway...");
        await new Promise(r => setTimeout(r, 10000));
        // Fallback: This would need suix_queryObjects but we found it missing.
        // We'll trust the user to check if it's there.
    }
  }

  if (bossId) {
    console.log(`✅ New Boss Spawned: ${bossId}`);
    const updatedEnv = envContent.replace(/NEXT_PUBLIC_BOSS_ID=0x[a-fA-F0-0-9]+/, `NEXT_PUBLIC_BOSS_ID=${bossId}`);
    fs.writeFileSync(envPath, updatedEnv);
    console.log("✅ .env.local updated. Restart server!");
  }
}

main().catch(console.error);
