import { Alchemy, Network } from 'alchemy-sdk';

// Optional config object, but defaults to the API key 'demo' and Network 'eth-mainnet'.
const settings = {
  apiKey: 'IwGO2kIZXDwf2wLfECr4W6YYa7-PA9cU', // Replace with your Alchemy API key.
  network: Network.ETH_MAINNET // Replace with your network.
};

const alchemy = new Alchemy(settings);

module.exports = alchemy;