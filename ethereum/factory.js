import web3 from "./web3";
import compiledFactory from'./build/CampaignFactory.json'

const instance= new web3.eth.Contract(compiledFactory.abi,"0x4020A6Ac2186f0273d6E84CB14e7CaEc8AB9615a")

export default instance