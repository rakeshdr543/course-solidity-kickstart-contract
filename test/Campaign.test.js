const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3")

const provider=ganache.provider()
const web3=new Web3(provider)

const compiledFactory=require('../ethereum/build/CampaignFactory.json')
const compiledCampaign=require('../ethereum/build/Campaign.json')

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });

  await factory.methods.createCampaign("10").send({
    from: accounts[1],
    gas: "1500000"
  });

 [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
})

describe('Campaign',()=>{
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
      });

      it("marks caller as the campaign manager",async()=>{
        const manager=await campaign.methods.manager().call()
        assert.equal(manager,accounts[1])
      })

      it('allows to contribute money and make them as contributors',async()=>{
        await campaign.methods.contribute().send({
          from:accounts[2],
          value:'11'
        })

        const contributor=await campaign.methods.approvers(accounts[2]).call()
        assert(contributor)
      })

      it('requires a minimum contribution',async()=>{
        try {
          await campaign.methods.contribute().send({
            from:accounts[3],
            value:'1'
          })
          assert(false)
        } catch (error) {
          assert(error)
        }
        
      })

      it('allows managers to make a payment request',async()=>{
        await campaign.methods.createRequest("Buying batteries",24,accounts[3]).send({
          from:accounts[1],
          gas:"1500000"
        })

        const request=await campaign.methods.requests(0).call()
        assert(request.description)
      })

      it('process requests',async()=>{
         await campaign.methods.contribute().send({
          from:accounts[2],
          value:web3.utils.toWei('10','ether')
        })

        await campaign.methods.createRequest("Buying batteries",web3.utils.toWei('7','ether'),accounts[3]).send({
          from:accounts[1],
          gas:"1500000"
        })

        await campaign.methods.approveRequest(0).send({
          from:accounts[2],
          gas:"1500000"
        })

      await campaign.methods.finalizeApprove(0).send({
          from:accounts[1],
          gas:"1500000"
        })

        let balance=await web3.eth.getBalance(accounts[3])
        balance=web3.utils.fromWei(balance,'ether')
        balance=parseFloat(balance)
      
        assert(balance>105)
      })
})