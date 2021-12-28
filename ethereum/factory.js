import web3 from "./web3";
import compiledFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  compiledFactory.abi,
  "0x8b0d61F502bE22122903F66FF8fa38F816a6C303"
);

export default instance;
