const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const { METAMASK_MNEMONIC_PHRASE, INFURA_KEY } = require('../env');

const provider = new HDWalletProvider(
    METAMASK_MNEMONIC_PHRASE,
    `https://rinkeby.infura.io/v3/${INFURA_KEY}`
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
     .deploy({data: '0x' + compiledFactory.bytecode}) // add 0x bytecode
     .send({from: accounts[0]}); // remove 'gas'

    console.log('Contract deployed to ',result?.options?.address);
};

deploy();

//0xBcadCbA382b80d3a97F1cBb5b93bedd7566CE191
//0x03C89E4a40CC853781693f9aD0BF54a24BEFbEFB
