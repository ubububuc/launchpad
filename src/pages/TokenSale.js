import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './TokenSale.css';
import whitelist from './whitelist'; // Import the whitelist

const recipientAddress = '0x6eaC0F083793CCA1E9BB25d51D990bC97B1b4213';
const ethPriceApiUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT';
const bnbPriceApiUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT';
const maticPriceApiUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT';
const avaxPriceApiUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=AVAXUSDT';
const tokenPriceInUSD = 0.01;

const TokenSale = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [ethPrice, setEthPrice] = useState(0);
  const [bnbPrice, setBnbPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [avaxPrice, setAvaxPrice] = useState(0);
  const [saleCompletedPercent, setSaleCompletedPercent] = useState(0);
  const [currentNetwork, setCurrentNetwork] = useState('ethereumSepolia'); // Default to Ethereum Sepolia

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ethResponse = await fetch(ethPriceApiUrl);
        const ethData = await ethResponse.json();
        setEthPrice(parseFloat(ethData.price));

        if (currentNetwork === 'bscTestnet') {
          const bnbResponse = await fetch(bnbPriceApiUrl);
          const bnbData = await bnbResponse.json();
          setBnbPrice(parseFloat(bnbData.price));
        }

        if (currentNetwork === 'maticMumbai') {
          const maticResponse = await fetch(maticPriceApiUrl);
          const maticData = await maticResponse.json();
          setMaticPrice(parseFloat(maticData.price));
        }

        if (currentNetwork === 'avaxFuji') {
          const avaxResponse = await fetch(avaxPriceApiUrl);
          const avaxData = await avaxResponse.json();
          setAvaxPrice(parseFloat(avaxData.price));
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, [currentNetwork]);

  useEffect(() => {
    const fetchSaleCompletion = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(
          currentNetwork === 'ethereumSepolia' ? 'https://eth-sepolia.g.alchemy.com/v2/demo' : 'YOUR_RPC_URL'
        );
        const balance = await provider.getBalance(recipientAddress);
        const totalSaleAmountInEth = ethers.formatEther(balance);
        let totalSaleAmountInUSD;

        if (currentNetwork === 'ethereumSepolia') {
          totalSaleAmountInUSD = totalSaleAmountInEth * ethPrice;
        } else if (currentNetwork === 'bscTestnet') {
          totalSaleAmountInUSD = totalSaleAmountInEth * bnbPrice;
        } else if (currentNetwork === 'maticMumbai') {
          totalSaleAmountInUSD = totalSaleAmountInEth * maticPrice;
        } else if (currentNetwork === 'avaxFuji') {
          totalSaleAmountInUSD = totalSaleAmountInEth * avaxPrice;
        }

        const salePercentage = (totalSaleAmountInUSD / (maxBuyLimitInUSD * 100)) * 100;
        setSaleCompletedPercent(salePercentage);
      } catch (error) {
        console.error('Error fetching sale completion:', error);
      }
    };

    fetchSaleCompletion();
  }, [ethPrice, bnbPrice, maticPrice, avaxPrice, currentNetwork]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
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
      ethereumSepolia: {
        chainId: '0xA4B1',
        chainName: 'Ethereum Sepolia',
        rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/demo'],
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      },
      bscTestnet: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        nativeCurrency: {
          name: 'Binance Coin',
          symbol: 'BNB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.bscscan.com'],
      },
      maticMumbai: {
        chainId: '0x13881',
        chainName: 'Matic Mumbai Testnet',
        rpcUrls: ['https://polygon-testnet.public.blastapi.io'],
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      },
      avaxFuji: {
        chainId: '0xa869',
        chainName: 'Avalanche Fuji Testnet',
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.snowtrace.io/'],
      },
      baseTestnet: {
        chainId: '0x12b',
        chainName: 'Base Testnet',
        rpcUrls: ['https://goerli.base.org'],
        nativeCurrency: {
          name: 'Base',
          symbol: 'BASE',
          decimals: 18,
        },
        blockExplorerUrls: ['https://goerli.basescan.org'],
      },
      optimismSepolia: {
        chainId: '0xa4b1',
        chainName: 'Optimism Sepolia',
        rpcUrls: ['https://sepolia.optimism.io'],
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://sepolia-optimistic.etherscan.io/'],
      },
      arbitrumTestnet: {
        chainId: '0x6e',
        chainName: 'Arbitrum Goerli Testnet',
        rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
        nativeCurrency: {
          name: 'Arbitrum',
          symbol: 'ARB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://goerli.arbiscan.io'],
      },
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
        setCurrentNetwork(network);
        return;
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkConfig.chainId }],
        });
        console.log('Network switched successfully');
        setCurrentNetwork(network);
      } catch (switchError) {
        if (switchError.code === 4902) {
          console.error('Network not added. Adding the network...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          });
          console.log('Network added successfully');
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: networkConfig.chainId }],
          });
          setCurrentNetwork(network);
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error('Failed to switch network:', error.message);
    }
  };

  const sendEther = async (amount) => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const tx = {
        to: recipientAddress,
        value: ethers.parseEther(amount),
      };

      const txResponse = await signer.sendTransaction(tx);
      await txResponse.wait();
      alert('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  const handleBuyTokens = () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const maxAmountInCurrentCurrency = currentNetwork === 'ethereumSepolia'
      ? parseFloat(ethers.formatEther(balance))
      : currentNetwork === 'bscTestnet'
      ? parseFloat(ethers.formatEther(balance)) * (bnbPrice / ethPrice)
      : currentNetwork === 'maticMumbai'
      ? parseFloat(ethers.formatEther(balance)) * (maticPrice / ethPrice)
      : currentNetwork === 'avaxFuji'
      ? parseFloat(ethers.formatEther(balance)) * (avaxPrice / ethPrice)
      : parseFloat(ethers.formatEther(balance));

    if (parseFloat(amount) > maxAmountInCurrentCurrency) {
      alert(`The max transaction can be ${maxAmountInCurrentCurrency.toFixed(6)} ${currentNetwork === 'ethereumSepolia' ? 'ETH' : currentNetwork === 'bscTestnet' ? 'BNB' : currentNetwork === 'maticMumbai' ? 'MATIC' : currentNetwork === 'avaxFuji' ? 'AVAX' : 'ETH'}`);
      return;
    }

    const equivalentUSD = parseFloat(amount) * (currentNetwork === 'ethereumSepolia' ? ethPrice : currentNetwork === 'bscTestnet' ? bnbPrice : currentNetwork === 'maticMumbai' ? maticPrice : currentNetwork === 'avaxFuji' ? avaxPrice : ethPrice);
    if (equivalentUSD > (whitelist[account.toLowerCase()]?.maxBuy || 0)) {
      alert(`The max transaction can be ${whitelist[account.toLowerCase()]?.maxBuy || 0} USD`);
      return;
    }

    if (!whitelist[account.toLowerCase()]) {
      alert('Your address is not whitelisted.');
      return;
    }

    sendEther(amount);
  };

  const equivalentUSD = parseFloat(amount) * (currentNetwork === 'ethereumSepolia' ? ethPrice : currentNetwork === 'bscTestnet' ? bnbPrice : currentNetwork === 'maticMumbai' ? maticPrice : currentNetwork === 'avaxFuji' ? avaxPrice : ethPrice);
  const tokensReceived = equivalentUSD / tokenPriceInUSD;

  return (
    <div className="token-sale-page">
      <div className="header">
        <div className="navbar">
          <a href="/home">Home</a>
          <a href="/tokensale">Token Sale</a>
          <a href="/claim">Claim</a>
          <a href="/vesting">Vesting</a>

          <div className="navbar-buttons">
            {account ? (
              <>
                <span className="wallet-address">
                  Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <div className="network-switcher">
                  <select onChange={(e) => switchNetwork(e.target.value)} value={currentNetwork}>
                    <option value="ethereumSepolia">Ethereum Sepolia</option>
                    <option value="bscTestnet">BSC Testnet</option>
                    <option value="maticMumbai">Matic Mumbai Testnet</option>
                    <option value="avaxFuji">Avalanche Fuji Testnet</option>
                    <option value="baseTestnet">Base Testnet</option>
                    <option value="optimismSepolia">Optimism Sepolia</option>
                    <option value="arbitrumTestnet">Arbitrum Testnet</option>
                  </select>
                </div>
              </>
            ) : (
              <button onClick={connectWallet} className="connect-wallet-button">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        <h1 className="title">Superchain Test Sale</h1>
      </div>

      <div className="page-content">
        {!account ? (
          <button onClick={connectWallet} className="connect-wallet-button">
            Connect Wallet
          </button>
        ) : (
          <>
            <p>Balance: {balance} {currentNetwork === 'ethereumSepolia' ? 'ETH' : currentNetwork === 'bscTestnet' ? 'BNB' : currentNetwork === 'maticMumbai' ? 'MATIC' : currentNetwork === 'avaxFuji' ? 'AVAX' : 'ETH'}</p>
            <p>Price per token: ${tokenPriceInUSD.toFixed(2)} USD</p>
            <p>Current Network Price: ${currentNetwork === 'ethereumSepolia' ? ethPrice.toFixed(2) : currentNetwork === 'bscTestnet' ? bnbPrice.toFixed(2) : currentNetwork === 'maticMumbai' ? maticPrice.toFixed(2) : currentNetwork === 'avaxFuji' ? avaxPrice.toFixed(2) : ethPrice.toFixed(2)} USD</p>
            <input
              type="number"
              placeholder={`Enter ${currentNetwork === 'ethereumSepolia' ? 'ETH' : currentNetwork === 'bscTestnet' ? 'BNB' : currentNetwork === 'maticMumbai' ? 'MATIC' : currentNetwork === 'avaxFuji' ? 'AVAX' : 'ETH'} amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="amount-input"
            />
            <button onClick={handleBuyTokens} className="buy-tokens-button">
              Buy Tokens
            </button>
            <p>Equivalent USD: ${equivalentUSD.toFixed(2)}</p>
            <p>Tokens Received: {tokensReceived.toFixed(2)}</p>
          </>
        )}

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${saleCompletedPercent}%` }}></div>
        </div>
        <p>Sale Completion: {saleCompletedPercent.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default TokenSale;
