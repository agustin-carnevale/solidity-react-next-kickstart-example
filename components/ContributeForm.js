import React, { useState } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

const ContributeForm = ({address}) => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        const campaignInstance = campaign(address);
        setLoading(true);
        setError('');
        try {
            const accounts = await web3.eth.getAccounts();
            await campaignInstance.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (error) {
            setError(error.message);
        }
        setValue('');
        setLoading(false);
    }

    return (
        <Form onSubmit={onSubmit} error={!!error}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    label="ether"
                    labelPosition="right"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
            </Form.Field>
            <Message error header="Oops!" content={error}/>
            <Button loading={loading} primary>Contribute!</Button>
        </Form>
    );
}

export default ContributeForm;