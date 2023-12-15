import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: '', 
  network: Network.ETH_MAINNET 
};

const alchemy = new Alchemy(settings);

module.exports = alchemy;