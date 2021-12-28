import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import ContributeForm from "../../../components/ContributeForm";

import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

const CampaignShow = () => {
  const router = useRouter();
  const { address } = router.query;

  const [balance, setBalance] = useState(0);
  const [manager, setManager] = useState();
  const [minimumContribution, setMinimumContribution] = useState();
  const [requestsCount, setRequestsCount] = useState();
  const [approversCount, setApproversCount] = useState();

  useEffect(() => {
    const fetchCampaign = async () => {
      const campaign = Campaign(address);

      const summary = await campaign.methods.getSummary().call();
      setMinimumContribution(summary[0]);
      setBalance(summary[1]);
      setRequestsCount(summary[2]);
      setApproversCount(summary[3]);
      setManager(summary[4]);
    };
    try {
      if (address) {
        fetchCampaign();
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [address]);

  const CampaignInfo = () => {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Requests must be approved by approvers",
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(String(balance), "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend.",
      },
    ];

    return <Card.Group items={items} />;
  };
  return (
    <>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <CampaignInfo />{" "}
          </Grid.Column>

          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default CampaignShow;
