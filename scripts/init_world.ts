import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  const envPath = path.resolve(process.cwd(), "frontend", ".env.local");
  const envContent = fs.readFileSync(envPath, "utf-8");
  const pkgMatch = envContent.match(/NEXT_PUBLIC_PACKAGE_ID=(0x[a-f0-9]+)/);
  if (!pkgMatch) throw new Error("PACKAGE_ID not found in .env.local");
  const packageId = pkgMatch[1];

  const keyPath = path.resolve(process.cwd(), "scripts", ".deploy_key.json");
  const { bech32 } = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  const parsedKey = decodeSuiPrivateKey(bech32);
  const keypair = Ed25519Keypair.fromSecretKey(parsedKey.secretKey);

  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`Using Package: ${packageId}`);
  console.log(`Deployer: ${address}`);

  const coins = await client.getCoins({ owner: address, coinType: "0x2::oct::OCT" });
  if (coins.data.length === 0) throw new Error("No OCT coins found for gas!");

  const tx = new Transaction();
  tx.setSender(address);
  tx.setGasBudget(2000000000n); // 2.0 OCT/ONE budget
  tx.setGasPayment(coins.data.map(c => ({
    objectId: c.coinObjectId,
    digest: c.digest,
    version: c.version
  })));
  tx.moveCall({
    target: `${packageId}::raid::spawn_boss`,
    arguments: [
      tx.pure.string("The Architect"),
      tx.pure.u64(50000),
      tx.pure.u64(5000)
    ],
  });

  console.log("Spawning Boss...");
  try {
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      options: { showObjectChanges: true, showEffects: true },
    });
    fs.writeFileSync(path.resolve(__dirname, 'debug_init.json'), JSON.stringify(result, null, 2));
    
    const bossObj = result.objectChanges?.find(
      (c: any) => c.type === "created" && c.objectType.includes("Boss")
    );
    if (!bossObj) throw new Error("Boss object not created in transaction.");
    const bossId = (bossObj as any).objectId;
    console.log(`✅ Boss Created: ${bossId}`);
    
    // Update .env.local
    let newEnv = envContent;
    if (newEnv.includes("NEXT_PUBLIC_BOSS_ID=")) {
      newEnv = newEnv.replace(/NEXT_PUBLIC_BOSS_ID=.*/, `NEXT_PUBLIC_BOSS_ID=${bossId}`);
    } else {
      newEnv += `NEXT_PUBLIC_BOSS_ID=${bossId}\n`;
    }
    fs.writeFileSync(envPath, newEnv);
    console.log("Updated .env.local successfully.");
  } catch (e: any) {
    fs.writeFileSync(path.resolve(__dirname, 'debug_init.json'), JSON.stringify({
      message: e.message,
      stack: e.stack,
      raw: e
    }, null, 2));
    throw e;
  }
}

main().catch(console.error);
