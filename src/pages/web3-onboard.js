import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0xaa36a7', // Sepolia Testnet Chain ID
      token: 'ETH',
      label: 'Ethereum Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    }
  ],
  appMetadata: {
    name: 'Token Sale',
    icon: '<svg><svg/>', // Use your own icon here
    description: 'A token sale application',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' }
    ]
  }
});

export default onboard;
