import Web3 from 'web3';

let web3;

// taking into account server side rendering of next.js

if ( typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are in the server or user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/8de9dbf268ab4cf589d48884dfac68b5' // url from infura
    ); // create our own provider with the infura provided node 
    web3 = new Web3(provider);
}

export default web3;