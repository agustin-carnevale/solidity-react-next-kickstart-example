import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import { Router, Link } from '../../../routes';
import web3 from '../../../ethereum/web3';
import campaign from '../../../ethereum/campaign';

const RequestNew = ({address}) => {
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        const campaignInstance = campaign(address);
        setLoading(true);
        setError('');

        try {
            const accounts = await web3.eth.getAccounts();
            await campaignInstance.methods.createRequest(
                description, 
                web3.utils.toWei(value, 'ether'), 
                recipient
            ).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>
                   Back
                </a>
            </Link>
            <h3>Create a Request</h3>
            <Form onSubmit={onSubmit} error={!!error}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                    />
                </Form.Field>
                <Message error header="Oops!" content={error}/>
                <Button loading={loading} primary>Create!</Button>
            </Form>
        </Layout>
    );
}

RequestNew.getInitialProps = (props) => {
    return { 
        address: props.query.address
    };
}

export default RequestNew;