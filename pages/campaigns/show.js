import React from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

const CampaignShow = ({
    address,
    balance, 
    manager, 
    minimumContribution, 
    requestsCount,
    approversCount
}) => {

    const renderSummary = () => {
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: {
                    overflowWrap: 'break-word'
                }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (Wei)',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money is left for the campaign to spend'
            },
        ]
        return <Card.Group items={items}/>
    }

    return (
        <Layout>
            <h3>Campaign Details</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderSummary()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm address={address}/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${address}/requests`}>
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
}

CampaignShow.getInitialProps = async (props) => {
    const campaignInstance = await campaign(props.query.address)
    const summary = await campaignInstance.methods.getSummary().call();
    return { 
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
        address: props.query.address
    };
}

export default CampaignShow;