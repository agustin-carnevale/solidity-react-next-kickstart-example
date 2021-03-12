import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance  = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x03C89E4a40CC853781693f9aD0BF54a24BEFbEFB'
);

export default instance;