# EthereumPyramid Contract Verification

**Byte-for-byte verified** creation bytecode for the EthereumPyramid (Pyramid) contract deployed on Ethereum mainnet.

## Contract

- **Address**: [`0x7011f3edc7fa43c81440f9f43a6458174113b162`](https://etherscan.io/address/0x7011f3edc7fa43c81440f9f43a6458174113b162)
- **Deployed**: September 7, 2015 (block 198,362)
- **Deployer**: `0xc469e0161968f12a38e4c1a1c153a18207e040c8`
- **ETH locked**: 69 ETH
- **Creation bytecode**: 3,377 bytes (+ 32-byte constructor arg on-chain = 3,409 bytes total)

## Compiler

- **Version**: soljson v0.1.1+commit.6ff4cd6
- **Optimizer**: OFF

## Verification

```bash
curl -o soljson-v0.1.1.js https://binaries.soliditylang.org/bin/soljson-v0.1.1+commit.6ff4cd6.js
npm install
node verify.js
```

## How to Reproduce

```js
const soljson = require("./soljson-v0.1.1.js");
const compile = soljson.cwrap("compileJSON", "string", ["string", "number"]);
const result = JSON.parse(compile(source, 0)); // 0 = optimizer OFF
const bytecode = result.contracts["Pyramid"].bytecode;
```

The on-chain creation bytecode has a 32-byte constructor argument appended:
```
0x0000000000000000000000004d6387f3b967da39b11de111158d49754c31985d
```
This encodes the `bitcoinBridge` address passed to the `Pyramid` constructor. Strip the last 64 hex characters before comparing.

## Contract Behavior

A classic 3:1 pyramid scheme with an unusual Bitcoin bridge feature. 1 ETH to enter; every 3rd participant triggers a payout of 2.7 ETH (90% of 3 ETH) to the earliest waiting participant. The remaining 10% goes to collected fees.

The contract supported Bitcoin payouts: participants could provide a Bitcoin address and the contract would route payouts through an on-chain Bitcoin bridge contract.

- **Entry price**: 1 ETH (exact - any excess is refunded)
- **Payout ratio**: 2.7 ETH for every 3 entries (10% fee)
- **Max description length**: 16 bytes
- **Max Bitcoin address length**: 35 bytes
- **Total participants**: 139 (as of final state)

### Key Finding

This contract was mislabeled as "EtherLottery" in several academic smart contract analysis datasets. The original site was `ethereumpyramid.com` and the contract is named `Pyramid` in the source. The BitcoinBridge integration made it one of the earliest cross-chain payment contracts on Ethereum.

69 ETH remains locked in the contract.

## Links

- [EthereumHistory.com](https://www.ethereumhistory.com/contract/0x7011f3edc7fa43c81440f9f43a6458174113b162)
- [awesome-ethereum-proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs)
