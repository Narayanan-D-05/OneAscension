import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SuiJsonRpcClient as SuiClient } from "@mysten/sui/jsonRpc";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import * as fs from "fs";
import * as path from "path";

const RPC_URL = "https://rpc-testnet.onelabs.cc";
const client = new SuiClient({ url: RPC_URL, network: "testnet" });

async function main() {
  const keyPath = path.resolve(process.cwd(), "scripts", ".deploy_key.json");
  const { bech32 } = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  const parsedKey = decodeSuiPrivateKey(bech32);
  const keypair = Ed25519Keypair.fromSecretKey(parsedKey.secretKey);
  const address = keypair.getPublicKey().toSuiAddress();

  console.log(`Checking Balance for: ${address}`);
  const coins = await client.getCoins({ owner: address, coinType: "0x2::oct::OCT" });
  
  let totalBalance = 0n;
  coins.data.forEach(c => totalBalance += BigInt(c.balance));
  
  console.log(`Total OCT Balance: ${Number(totalBalance) / 1e9} ONE/OCT`);
  console.log(`Coin Count: ${coins.data.length}`);
}

main().catch(console.error);
