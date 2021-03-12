import React from 'react'
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

const CampaignIndex = ({ campaigns }) => {

    const renderCampaigns = () => {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />
    }

    return (
    <Layout>
        <div>
            <h2>Open Campaigns</h2>
            <Link route="/campaigns/new">
                <a>
                    <Button
                        content="Create Campaign"
                        icon="add circle"
                        floated='right'
                        primary
                    />
                </a>
            </Link>
            {renderCampaigns()}
        </div>
    </Layout>
    );
};

CampaignIndex.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
}

export default CampaignIndex;