import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

const {Header, Row, HeaderCell, Body, Cell} = Table;

const RequestRow = ({id, request, address, approversCount}) => {

    const readyToFinalize = request.approvalsCount > approversCount /2;

    const onApprove = async () => {
        const campaignInstance = campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaignInstance.methods.approveRequest(id).send({
            from: accounts[0]
        });
    }

    const onFinalize = async () => {
        const campaignInstance = campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaignInstance.methods.finalizeRequest(id).send({
            from: accounts[0]
        });
    }

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>{request.approvalsCount} / {approversCount}</Cell>
            <Cell>
                {!request.complete &&
                    <Button 
                        color="green"
                        onClick={onApprove}
                    >
                        Approve
                    </Button>
                }
            </Cell>
            <Cell>
                {!request.complete &&
                    <Button 
                        color="red"
                        onClick={onFinalize}
                    >
                        Finalize
                    </Button>
                }
            </Cell>
        </Row>
    );
}

const RequestIndex = ({address, requests, approversCount}) => {


    const renderRequestsTable = () => {
        return (
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approvals Count</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {requests.map((request, index)=> 
                        <RequestRow 
                            id={index} 
                            key={index} 
                            request={request} 
                            address={address} 
                            approversCount={approversCount}
                        />
                    )}
                </Body>
            </Table>
        );
    }

    return (
        <Layout>
            <h3>Requests List</h3>
            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated="right" style={{marginBottom: '15px'}}>
                        Add Request
                    </Button>
                </a>
            </Link>
            {renderRequestsTable()}
            <div>Found {requests.length} requests.</div>
        </Layout>
    );
}

RequestIndex.getInitialProps = async (props) => {
    const address = props.query.address;
    const campaignInstance = campaign(address);
    const requestCount = await campaignInstance.methods.getRequestsCount().call();
    const approversCount = await campaignInstance.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element,index) => {
            return campaignInstance.methods.requests(index).call()
        })
    );
    console.log(requests)
    return { 
        address,
        requests,
        approversCount
    };
}

export default RequestIndex;