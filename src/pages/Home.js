import React from 'react';
import './HomePage.css'; // Ensure this is correctly named

const Header = ({ account, connectWallet, switchNetwork }) => {
  return (
    <div className="homepage">
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
                  <select onChange={(e) => switchNetwork(e.target.value)}>
                    <option value="sepolia">Sepolia</option>
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
        <div className="future-idos">
          <h2>Exciting IDOs Coming Soon!</h2>
          <p>Stay tuned for multiple Initial DEX Offerings (IDOs) launching soon on our platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
