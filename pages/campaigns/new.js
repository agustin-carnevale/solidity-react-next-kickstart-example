import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const CampaignNew = ({  }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(value).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    }

    return (
    <Layout>
        <div>
            <h3>Create a Campaign!</h3>
            <Form onSubmit={onSubmit} error={!!error}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input label="wei" labelPosition="right" onChange={e=> setValue(e.target.value)} value={value} />
                </Form.Field>

                <Message error header="Oops!" content={error}/>
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </div>
    </Layout>
    );
};

CampaignNew.getInitialProps = async () => {
    // const campaigns = await factory.methods.getDeployedCampaigns().call();
    // return { campaigns };
    return {};
}

export default CampaignNew;