import { useEffect, useState } from "react";
import factory from "../ethereum/factory";
import { Button, Card, Icon } from "semantic-ui-react";
import Link from "next/link";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignsArray = await factory.methods
        .getDeployedCampaigns()
        .call();
      setCampaigns(campaignsArray);
    };
    fetchCampaigns();
  }, []);

  const CampaignComponent = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  return (
    <div>
      <h3>Open Campaigns</h3>

      <Link href="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </a>
      </Link>
      <CampaignComponent />
    </div>
  );
}
