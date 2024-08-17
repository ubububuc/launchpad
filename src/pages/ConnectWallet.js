import React, { useState, useEffect } from 'react';
import onboard from './web3-onboard';
import { ethers } from 'ethers';

function ConnectWallet({ onConnect }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      const wallets = await onboard.connectWallet();
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const provider = new ethers.BrowserProvider(wallet.provider);
        const account = wallet.accounts[0].address;
        const balance = await provider.getBalance(account);

        setAccount(account);
        setBalance(ethers.formatEther(balance));
        onConnect(account);
        setError(null);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError('Failed to connect wallet');
    }
  };

  useEffect(() => {
    const checkWalletConnected = async () => {
      const wallets = onboard.state.get().wallets;
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const provider = new ethers.BrowserProvider(wallet.provider);
        const account = wallet.accounts[0].address;
        const balance = await provider.getBalance(account);

        setAccount(account);
        setBalance(ethers.formatEther(balance));
        setError(null);
      }
    };

    checkWalletConnected();
  }, []);

  return (
    <div className="container mx-auto px-6 py-16 text-center">
      {account ? (
        <div>
          <p className="text-lg mb-4">Connected Account: {account}</p>
          <p className="text-lg mb-4">Balance: {balance ? `${balance} ETH` : 'Loading...'}</p>
          <button
            onClick={() => {
              setAccount(null);
              setBalance(null);
              setError(null);
            }}
            className="bg-red-600 text-white py-2 px-6 rounded-full"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white py-2 px-6 rounded-full"
          >
            Connect Wallet
          </button>
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
