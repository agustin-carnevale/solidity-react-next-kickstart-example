pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        uint approvalsCount;
        mapping(address => bool) approvals;
        bool complete;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;
    
    
    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createRequest(
        string description, 
        uint value, 
        address recipient
    ) public restrictedToManager{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            approvalsCount: 0,
            complete: false
        });
        
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]); // person already donated
        require(!request.approvals[msg.sender]); // person has not voted on this request yet
        
        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }
    
    function finalizeRequest(uint index) public restrictedToManager{
         Request storage request = requests[index];
         
         require(!request.complete);
         require(address(this).balance >= request.value);
         require(request.approvalsCount > (approversCount / 2));
         
         request.recipient.transfer(request.value);
         request.complete = true;
    }
    
    function currentBalance() public view returns (uint){
        return address(this).balance;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}