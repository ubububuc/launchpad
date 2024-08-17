import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ account, connectWallet, switchNetwork }) => {
  const [network, setNetwork] = useState('0x5'); // Default to Sepolia
  const [price, setPrice] = useState(null);

  const fetchPrice = async (networkId) => {
    let priceUrl;
    switch (networkId) {
      case '0x61': // BSC Testnet
        priceUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'; // Binance API for BNB price
        break;
      case '0xA869': // Avalanche Fuji Testnet
        priceUrl = 'https://api.avax.network/ext/bc/C/rpc'; // Example; replace with an actual API for AVAX price
        break;
      case '0x13881': // Polygon Mumbai Testnet
        priceUrl = 'https://api.polygonscan.com/api'; // Example; replace with an actual API for MATIC price
        break;
      default: // Ethereum and other networks
        priceUrl = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YOUR_API_KEY'; // Replace with actual API
    }

    try {
      const response = await fetch(priceUrl);
      const data = await response.json();
      setPrice(data.price || 'N/A'); // Adjust based on the API response structure
    } catch (error) {
      console.error('Error fetching price:', error);
      setPrice('N/A');
    }
  };

  useEffect(() => {
    fetchPrice(network);
  }, [network]);

  const handleNetworkChange = (event) => {
    const selectedNetwork = event.target.value;
    setNetwork(selectedNetwork);
    switchNetwork(selectedNetwork);
  };

  return (
    <div className="header">
      <div className="navbar">
        <a href="/home">Home</a>
        <a href="/tokensale">Token Sale</a>
        <a href="/claim">Claim</a>
        <a href="/vesting">Vesting</a>
      </div>
      <div className="wallet-info">
        {account ? (
          <>
            <span className="wallet-address">Wallet: {account.slice(0, 6)}...{account.slice(-4)}</span>
            <div className="network-switcher">
              <select onChange={handleNetworkChange} value={network}>
                <option value="0x5">Sepolia Ethereum Testnet</option>
                <option value="0x61">BSC Testnet</option>
                <option value="0x13881">Polygon Mumbai Testnet</option>
                <option value="0x1E">Base Testnet</option>
                <option value="0xA869">Avalanche Fuji Testnet</option>
                <option value="0xA4B1">Arbitrum Rinkeby Testnet</option>
                <option value="0xA5">Optimism Goerli Testnet</option>
              </select>
            </div>
            <div className="price-info">
              {price ? <span>Current Token Price: {price}</span> : <span>Loading price...</span>}
            </div>
          </>
        ) : (
          <button className="connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </div>
  );
};

export default Header;
