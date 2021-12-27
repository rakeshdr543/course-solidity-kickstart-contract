// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CampaignFactory {
    Campaign[] public campaignsList;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        campaignsList.push(newCampaign);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaignsList;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    uint256 public numRequests;
    mapping(uint256 => Request) requests;

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(minimumContribution < msg.value);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(
            approvers[msg.sender],
            "To approve request needs to a approver"
        );
        require(!request.approvals[msg.sender], "You can vote only once");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeApprove(uint256 index) public restricted {
        Request storage request = requests[index];
        require(
            request.approvalCount > (approversCount / 2),
            "Needs atleast half members approval"
        );
        require(!request.complete, "Request already completed");

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
