import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';


const Vesting = () => {
  const [account, setAccount] = useState('');
  const [currentNetwork, setCurrentNetwork] = useState('');

  useEffect(() => {
    const fetchAccountAndNetwork = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const network = await provider.getNetwork();
          setCurrentNetwork(network.chainId);
        }
      }
    };
    fetchAccountAndNetwork();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const network = await provider.getNetwork();
          setCurrentNetwork(network.chainId);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const switchNetwork = async (network) => {
    const networkConfigs = {
      sepolia: { chainId: '0xA4B1', chainName: 'Optimism Sepolia', rpcUrls: ['https://sepolia.optimism.io'], nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://sepolia-optimistic.etherscan.io/'] },
      bscTestnet: { chainId: '0x61', chainName: 'Binance Smart Chain Testnet', rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'], nativeCurrency: { name: 'Binance Coin', symbol: 'BNB', decimals: 18 }, blockExplorerUrls: ['https://testnet.bscscan.com'] },
      maticTestnet: { chainId: '0x13881', chainName: 'Matic Mumbai Testnet', rpcUrls: ['https://polygon-testnet.public.blastapi.io'], nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 }, blockExplorerUrls: ['https://mumbai.polygonscan.com/'] },
      baseTestnet: { chainId: '0x7A', chainName: 'Base Testnet', rpcUrls: ['https://goerli.base.org'], nativeCurrency: { name: 'Base', symbol: 'BASE', decimals: 18 }, blockExplorerUrls: ['https://base-goerli.etherscan.io/'] },
      avaxTestnet: { chainId: '0xA869', chainName: 'Avalanche Fuji Testnet', rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'], nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 }, blockExplorerUrls: ['https://testnet.snowtrace.io/'] },
      arbitrumTestnet: { chainId: '0x66EE', chainName: 'Arbitrum Testnet', rpcUrls: ['https://rinkeby.arbitrum.io/rpc'], nativeCurrency: { name: 'Arbitrum', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://testnet.arbiscan.io/'] },
      optimismTestnet: { chainId: '0x4', chainName: 'Optimism Testnet', rpcUrls: ['https://goerli.optimism.io'], nativeCurrency: { name: 'Optimism ETH', symbol: 'ETH', decimals: 18 }, blockExplorerUrls: ['https://goerli-optimistic.etherscan.io/'] },
    };

    const networkConfig = networkConfigs[network];
    if (!networkConfig) {
      console.error('Network configuration not found');
      return;
    }

    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (currentChainId === networkConfig.chainId) {
        console.log('Already on the selected network');
        setCurrentNetwork(networkConfig.chainId);
        return;
      }

      try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: networkConfig.chainId }] });
        console.log('Network switched successfully');
        setCurrentNetwork(networkConfig.chainId);
      } catch (switchError) {
        if (switchError.code === 4902) {
          console.error('Network not added. Adding the network...');
          await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [networkConfig] });
          console.log('Network added successfully');
          await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: networkConfig.chainId }] });
          setCurrentNetwork(networkConfig.chainId);
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error('Failed to switch network:', error.message);
    }
  };

  const displayAccount = typeof account === 'string' && account.length > 0
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : 'Not Connected';

  return (
    <div className="vesting-page">
      <header className="header">
        <div className="navbar">
          <a href="/home">Home</a>
          <a href="/tokensale">Token Sale</a>
          <a href="/claim">Claim</a>
          <a href="/vesting">Vesting</a>
          <div className="navbar-buttons">
            {account ? (
              <>
                <span className="wallet-address">
                  Wallet: {displayAccount}
                </span>
                <div className="network-switcher">
                  <select onChange={(e) => switchNetwork(e.target.value)} value={currentNetwork}>
                    <option value="sepolia">Optimism Sepolia</option>
                    <option value="bscTestnet">BSC Testnet</option>
                    <option value="maticTestnet">Matic Testnet</option>
                    <option value="baseTestnet">Base Testnet</option>
                    <option value="avaxTestnet">Avax Testnet</option>
                    <option value="arbitrumTestnet">Arbitrum Testnet</option>
                    <option value="optimismTestnet">Optimism Testnet</option>
                  </select>
                </div>
              </>
            ) : (
              <button className="connect-wallet-button" onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="p-4">
        <h2 className="text-2xl mb-4">Vesting Schedule</h2>
        <p>Details about the vesting schedule will go here.</p>
      </div>
    </div>
  );
};

export default Vesting;
