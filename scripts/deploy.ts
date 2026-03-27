import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Transaction } from "@mysten/sui/transactions";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc:443";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  // ─── Step 1: Load or generate a deployment keypair ───────────────────────
  const keyFile = path.resolve(__dirname, ".deploy_key.json");
  let keypair: Ed25519Keypair;
  if (fs.existsSync(keyFile)) {
    const raw = JSON.parse(fs.readFileSync(keyFile, "utf-8"));
    const parsedKey = decodeSuiPrivateKey(raw.bech32);
    keypair = Ed25519Keypair.fromSecretKey(parsedKey.secretKey);
    console.log("  Loaded existing keypair from bech32.");
  } else {
    keypair = new Ed25519Keypair();
    fs.writeFileSync(
      keyFile,
      JSON.stringify({ bech32: keypair.getSecretKey() })
    );
    console.log("  Generated NEW keypair and saved to .deploy_key.json");
  }

  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`\n  Deployer Address : ${address}`);
  console.log(`  Network          : testnet (${RPC_URL})\n`);

  // ─── Step 2: Check balance ────────────────────────────────────────────────
  const coins = await client.getCoins({ owner: address, coinType: '0x2::oct::OCT' });
  const balance =
    coins.data.reduce((sum: bigint, c: any) => sum + BigInt(c.balance), 0n) / 1_000_000_000n;
  console.log(`  Wallet Balance   : ${balance} ONE`);

  if (balance === 0n) {
    console.log("  Balance is 0. Requesting faucet tokens...\n");
    try {
      const faucetRes = await fetch(
        "https://faucet-testnet.onelabs.cc/gas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            FixedAmountRequest: { recipient: address },
          }),
        }
      );
      const result = await faucetRes.json();
      console.log("  Faucet Response  :", JSON.stringify(result, null, 2));
      console.log("\n  Waiting 5s for funds to settle...");
      await new Promise((r) => setTimeout(r, 5000));
    } catch (e: any) {
      console.error("  Faucet request failed:", e.message);
      process.exit(1);
    }
  }

  // ─── Step 3: Build Move contracts ─────────────────────────────────────────
  const { execSync } = require("child_process");
  const contractsDir = path.resolve(__dirname, "..", "contracts");
  console.log("\n  Building Move contracts...");
  let rawBuild = "";
  try {
    rawBuild = execSync("one move build --dump-bytecode-as-base64", { cwd: contractsDir, encoding: "utf-8" });
  } catch {
    console.log("  `one` CLI not found/failed, trying `sui` CLI...");
    const suiBin = "C:\\Users\\dnara\\.sui\\bin\\sui.exe";
    const buildCmd = `${suiBin} move build --dump-bytecode-as-base64`;
    console.log(`  Executing: ${buildCmd}`);
    const buildOutput = execSync(buildCmd, {
      cwd: path.resolve(__dirname, "../contracts"),
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });
    rawBuild = buildOutput;
  }

  // ─── Step 4: Publish ──────────────────────────────────────────────────────
  console.log("\n  Publishing contracts to OneChain Testnet...");

  // Strip out any CLI warnings printed before the actual JSON object
  const jsonStr = rawBuild.substring(rawBuild.indexOf("{"));
  const buildResult = JSON.parse(jsonStr);

  const tx = new Transaction();
  tx.setSender(address);
  tx.setGasBudget(100_000_000);
  tx.setGasPayment(coins.data.map((c: any) => ({
    objectId: c.coinObjectId,
    digest: c.digest,
    version: c.version
  })));

  const upgradeCap = tx.publish({
    modules: buildResult.modules,
    dependencies: buildResult.dependencies,
  });
  tx.transferObjects([upgradeCap], address);

  let result;
  try {
    result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      options: { showObjectChanges: true, showEffects: true },
    });
  } catch (e: any) {
    fs.writeFileSync(path.resolve(__dirname, 'last_error.json'), JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
    throw e;
  }

  console.log("\n  ✅ DEPLOYMENT SUCCESSFUL!\n");
  console.log("  Transaction Digest :", result.digest);

  const packageObj = result.objectChanges?.find(
    (c: any) => c.type === "published"
  );
  const sharedObjects = result.objectChanges?.filter(
    (c: any) => c.type === "created"
  );

  const packageId = (packageObj as any)?.packageId ?? "NOT_FOUND";
  console.log("  PACKAGE_ID         :", packageId);

  // ─── Step 5: Spawn initial Boss ──────────────────────────────────────────
  console.log("\n  Spawning initial Raid Boss...");
  const spawnTx = new Transaction();
  spawnTx.moveCall({
    target: `${packageId}::raid::spawn_boss`,
    arguments: [
      spawnTx.pure.string("The Architect"),
      spawnTx.pure.u64(50000), // HP
      spawnTx.pure.u64(5000)   // XP
    ],
  });

  const spawnResult = await client.signAndExecuteTransaction({
    transaction: spawnTx,
    signer: keypair,
    options: { showObjectChanges: true },
  });

  const bossObj = spawnResult.objectChanges?.find(
    (c: any) => c.type === "created" && c.objectType.includes("Boss")
  );
  const bossId = (bossObj as any)?.objectId ?? "NOT_FOUND";

  const envLines = [
    `NEXT_PUBLIC_NETWORK=testnet`,
    `NEXT_PUBLIC_RPC_URL=${RPC_URL}`,
    `NEXT_PUBLIC_PACKAGE_ID=${packageId}`,
    `NEXT_PUBLIC_BOSS_ID=${bossId}`,
    `NEXT_PUBLIC_LEADERBOARD_ID=${(sharedObjects?.find((o: any) => o.objectType.includes("Leaderboard")) as any)?.objectId ?? "NOT_FOUND"}`
  ];

  const envPath = path.resolve(__dirname, "..", "frontend", ".env.local");
  fs.writeFileSync(envPath, envLines.join("\n") + "\n");
  console.log(`\n  ✅ WORLD INITIALIZED!`);
  console.log("  BOSS_ID            :", bossId);
  console.log(`  .env.local updated at ${envPath}`);
  console.log("  Restart the Next.js dev server to apply the new IDs!\n");
}

main().catch((e) => {
  console.error("Deploy failed:", e);
  process.exit(1);
});
