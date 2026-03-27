import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc:443";
const FAUCET_URL = "https://faucet-testnet.onelabs.cc/gas";

const client = new SuiClient({ url: RPC_URL, network: "testnet" });
const keyFile = path.resolve(process.cwd(), "scripts", ".deploy_key.json");

async function getOrCreateKeypair(): Promise<Ed25519Keypair> {
  if (fs.existsSync(keyFile)) {
    const { bech32 } = JSON.parse(fs.readFileSync(keyFile, "utf-8"));
    const keypair = Ed25519Keypair.fromSecretKey(bech32);
    console.log("  ✓ Loaded existing deployment keypair.");
    return keypair;
  }

  // Generate fresh keypair - export as bech32 (suiprivkey1...) for easy re-import
  const keypair = new Ed25519Keypair();
  const exported = keypair.getSecretKey(); // Returns bech32-encoded string
  fs.writeFileSync(keyFile, JSON.stringify({ bech32: exported }));
  console.log("  ✓ Generated NEW keypair, saved to scripts/.deploy_key.json");
  return keypair;
}

async function main() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  OneAscension :: Account Setup & Faucet");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const keypair = await getOrCreateKeypair();
  const address = keypair.getPublicKey().toSuiAddress();

  console.log(`  Address  : ${address}`);
  console.log(`  RPC      : ${RPC_URL}\n`);

  // Check current balance
  let balance = 0n;
  try {
    const coins = await client.getCoins({ owner: address });
    balance = coins.data.reduce((sum: bigint, c: any) => sum + BigInt(c.balance), 0n);
    console.log(`  Balance  : ${Number(balance) / 1_000_000_000} ONE`);
  } catch {
    console.log("  Balance  : (could not reach OneChain RPC)");
  }

  if (balance === 0n) {
    console.log("\n  Requesting faucet tokens...");
    try {
      const res = await fetch(FAUCET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FixedAmountRequest: { recipient: address } }),
      });

      const text = await res.text();
      if (res.ok) {
        console.log("  ✓ Faucet OK:", text);
        console.log("  Waiting 5s for funds to settle...");
        await new Promise((r) => setTimeout(r, 5000));
        const updated = await client.getCoins({ owner: address });
        const newBal = updated.data.reduce((s: bigint, c: any) => s + BigInt(c.balance), 0n);
        console.log(`  ✓ New Balance: ${Number(newBal) / 1_000_000_000} ONE`);
      } else {
        console.log(`  ✗ Faucet HTTP ${res.status}: ${text}`);
        console.log(`\n  ► Copy your address and use the manual faucet:`);
        console.log(`    https://faucet-testnet.onelabs.cc`);
        console.log(`    Address: ${address}\n`);
      }
    } catch (e: any) {
      console.log("  ✗ Faucet error:", e.message);
      console.log(`\n  ► Copy your address and use the manual faucet:`);
      console.log(`    https://faucet-testnet.onelabs.cc`);
      console.log(`    Address: ${address}\n`);
    }
  } else {
    console.log("  ✓ Wallet has sufficient funds for deployment!");
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Next: once funded, run  npm run deploy  to publish contracts");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
