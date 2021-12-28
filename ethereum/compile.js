const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
const contractFileName = "Campaign.sol";

// Deleting existing build folder
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", contractFileName);
const source = fs.readFileSync(campaignPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {},
  settings: {
    metadata: {
      useLiteralContent: true,
    },
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

input.sources[contractFileName] = {
  content: source,
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts[contractFileName];

// Create build folder
fs.ensureDirSync(buildPath);

// Extract and write json representation of contract
for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    fs.outputJSONSync(
      path.resolve(buildPath, `${contract}.json`),
      contracts[contract]
    );
  }
}
