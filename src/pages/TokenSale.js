import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './TokenSale.css';

const recipientAddress = '0x6eaC0F083793CCA1E9BB25d51D990bC97B1b4213';
const whitelistAddress = '0x6bd501dA65D9634e69fEB2E2cE5f456715e3E29F';
const ethPriceApiUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT';
const tokenPriceInUSD = 0.01; // Price per token in USD
const maxBuyLimitInUSD = 250; // Max buy limit in USD

const TokenSale = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [ethPrice, setEthPrice] = useState(0);
  const [saleCompletedPercent, setSaleCompletedPercent] = useState(0);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch(ethPriceApiUrl);
        const data = await response.json();
        setEthPrice(parseFloat(data.price));
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    const fetchSaleCompletion = async () => {
      try {
        const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL'); // Replace with your provider URL
        const balance = await provider.getBalance(recipientAddress);
        const totalSaleAmountInEth = ethers.formatEther(balance);
        const totalSaleAmountInUSD = totalSaleAmountInEth * ethPrice;
        const salePercentage = (totalSaleAmountInUSD / (maxBuyLimitInUSD * 100)) * 100;
        setSaleCompletedPercent(salePercentage);
      } catch (error) {
        console.error('Error fetching sale completion:', error);
      }
    };

    fetchSaleCompletion();
  }, [ethPrice]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to connect your wallet.');
    }
  };

  const switchNetwork = async (network) => {
    const networks = {
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
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      },
    };

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks[network].chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: networks[network].chainId,
                chainName: networks[network].chainName,
                rpcUrls: networks[network].rpcUrls,
                nativeCurrency: networks[network].nativeCurrency,
                blockExplorerUrls: networks[network].blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error(`Failed to add ${network} network:`, addError);
        }
      } else {
        console.error(`Failed to switch to ${network} network:`, error);
      }
    }
  };

  const sendEther = async (amount) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = {
        to: recipientAddress,
        value: ethers.parseUnits(amount.toString(), 'ether'),
      };

      const txResponse = await signer.sendTransaction(tx);
      await txResponse.wait();
      alert('Transaction successful!');
    } catch (error) {
      console.error('Error sending ether:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  const handleBuyTokens = () => {
    const maxAmount = parseFloat(balance) - 0.002;
    if (parseFloat(amount) > maxAmount) {
      alert(`The max transaction can be ${maxAmount.toFixed(6)} ETH`);
      return;
    }

    const equivalentUSD = parseFloat(amount) * ethPrice;
    if (equivalentUSD > maxBuyLimitInUSD) {
      alert(`The max transaction can be ${maxBuyLimitInUSD} USD`);
      return;
    }

    if (account.toLowerCase() !== whitelistAddress.toLowerCase()) {
      alert('Your address is not whitelisted.');
      return;
    }

    sendEther(amount);
  };

  const equivalentUSD = parseFloat(amount) * ethPrice;
  const tokensReceived = equivalentUSD / tokenPriceInUSD;

  return (
    <div>
      <div className="navbar">
        <a href="/home">Home</a>
        <a href="/tokensale">Token Sale</a>
        <a href="/claim">Claim</a>
        <a href="/vesting">Vesting</a>

        <div className="network-dropdown">
          <button className="network-switch">Switch Network</button>
          <div className="dropdown-content">
            <button onClick={() => switchNetwork('bscTestnet')}>BSC Testnet</button>
            <button onClick={() => switchNetwork('maticMumbai')}>Matic Mumbai Testnet</button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <h1 className="title">Superchain Test Sale</h1>

        {!account ? (
          <button onClick={connectWallet} className="connect-wallet-button">
            Connect Wallet
          </button>
        ) : (
          <>
            <p>Connected Account: {account}</p>
            <p>Balance: {balance} ETH</p>
            <p>Price per token: ${tokenPriceInUSD.toFixed(2)} USD</p>
            <p>ETH Price: ${ethPrice.toFixed(2)} USD</p>
            <input
              type="number"
              placeholder="Enter ETH amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="amount-input"
            />
            <button onClick={handleBuyTokens} style={{ marginLeft: '10px' }}>Buy Tokens</button>
            <p>Equivalent USD amount: ${equivalentUSD.toFixed(2)}</p>
            <p>You will receive: {tokensReceived.toFixed(2)} tokens</p>
            <p>Sale Completed: {saleCompletedPercent.toFixed(2)}%</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenSale;
