/**
 * Verification proof for contract 0x7011f3edc7fa43c81440f9f43a6458174113b162
 * EthereumPyramid (Pyramid) - one of the earliest pyramid scheme contracts on Ethereum.
 *
 * Compiles Pyramid.sol with soljson v0.1.1+commit.6ff4cd6 (optimizer OFF)
 * and compares against on-chain creation bytecode (excluding 32-byte constructor arg).
 *
 * Usage:
 *   curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
 *   npm install solc
 *   node verify.js
 */

const fs = require("fs");
const path = require("path");

const soljson = require(path.join(__dirname, "soljson-v0.1.1.js"));
const compile = soljson.cwrap("compileJSON", "string", ["string", "number"]);

const onchainHex = fs
  .readFileSync(path.join(__dirname, "onchain-creation.hex"), "utf8")
  .trim()
  .replace(/^0x/, "");

// Strip the 32-byte constructor argument (last 64 hex chars)
// The constructor arg encodes the bitcoinBridge address:
//   0x0000000000000000000000004d6387f3b967da39b11de111158d49754c31985d
const onchainStripped = onchainHex.slice(0, -64);

const source = fs.readFileSync(path.join(__dirname, "Pyramid.sol"), "utf8");

// Compile with optimizer OFF (0)
const result = JSON.parse(compile(source, 0));

if (result.errors && result.errors.length > 0) {
  console.error("Compilation errors:", result.errors);
  process.exit(1);
}

const compiledHex = result.contracts["Pyramid"].bytecode;

console.log("Compiler: soljson v0.1.1+commit.6ff4cd6");
console.log("Optimizer: OFF");
console.log("");
console.log("Compiled creation bytecode:", compiledHex.length / 2, "bytes");
console.log("On-chain creation bytecode:", onchainHex.length / 2, "bytes total");
console.log("On-chain (minus 32-byte constructor arg):", onchainStripped.length / 2, "bytes");
console.log("");

if (compiledHex.toLowerCase() === onchainStripped.toLowerCase()) {
  console.log("EXACT MATCH - byte-for-byte identical (" + compiledHex.length / 2 + " bytes)");
  console.log("");
  console.log("Contract:       0x7011f3edc7fa43c81440f9f43a6458174113b162");
  console.log("Block:          198,362 (September 7, 2015)");
  console.log("Deployer:       0xc469e0161968f12a38e4c1a1c153a18207e040c8");
  console.log("Constructor:    bitcoinBridge = 0x4d6387f3b967da39b11de111158d49754c31985d");
  console.log("Source:         Pyramid.sol");
  console.log("Compiler:       soljson v0.1.1+commit.6ff4cd6");
  console.log("Settings:       optimizer off");
} else {
  console.log("NO MATCH");
  for (let i = 0; i < Math.max(compiledHex.length, onchainStripped.length); i++) {
    if ((compiledHex[i] || "").toLowerCase() !== (onchainStripped[i] || "").toLowerCase()) {
      console.log("First difference at byte", Math.floor(i / 2));
      console.log("  Compiled:", compiledHex.substring(i, i + 20));
      console.log("  On-chain:", onchainStripped.substring(i, i + 20));
      break;
    }
  }
  process.exit(1);
}
