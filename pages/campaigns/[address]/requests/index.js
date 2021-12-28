import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Header, Table } from "semantic-ui-react";
import RequestRow from "../../../../components/RequestRow";
import Campaign from "../../../../ethereum/campaign";

const RequestsIndex = () => {
  const router = useRouter();
  const { address } = router.query;

  const [approversCount, setApproversCount] = useState();
  const [requestsCount, setRequestsCount] = useState();
  const [requests, SetRequests] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
      const campaign = Campaign(address);

      const requestsCountData = await campaign.methods
        .getRequestsCount()
        .call();
      const approversCountData = await campaign.methods.approversCount().call();

      const requestsData = await Promise.all(
        Array(parseInt(requestsCountData))
          .fill()
          .map((_element, index) => campaign.methods.requests(index).call())
      );

      setApproversCount(approversCountData);
      setRequestsCount(requestsCountData);
      SetRequests(requestsData);
    };
    try {
      if (address) {
        fetchRequests();
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [address]);

  const { Header, Row, HeaderCell, Body } = Table;

  const RenderRows = () => {
    return requests.map((request, index) => {
      console.log(request, approversCount);
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };

  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{requests?.length && <RenderRows />}</Body>
      </Table>
      <div>Found {requestsCount} requests.</div>
    </>
  );
};

export default RequestsIndex;
