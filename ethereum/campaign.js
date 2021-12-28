import web3 from "./web3";
import compiledCampaign from "./build/Campaign.json";

const Campaign = (address) =>
  new web3.eth.Contract(compiledCampaign.abi, address);

export default Campaign;
