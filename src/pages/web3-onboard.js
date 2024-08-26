import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: '0x1', // Ethereum Mainnet
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    },
    {
      id: '0x13881', // Matic Mumbai Testnet
      token: 'MATIC',
      label: 'Matic Mumbai Testnet',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com'
    },
    {
      id: '0x61', // BSC Testnet
      token: 'BNB',
      label: 'Binance Smart Chain Testnet',
      rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    },
    {
      id: '0xaa36a7', // Sepolia Testnet
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
